#!/usr/bin/env python3
"""Fetch Yay Attax card pictures.

    python3 scripts/fetch_card_images.py <league> [--force slug,slug] [--sheet out.png]

Reads scripts/card-images/<league>.json, a list of {"slug": ..., "src": ...}, where src is one of

    wiki:<Article title>          the article's lead image on English Wikipedia
    file:<File name.jpg>          a file on Wikimedia Commons (or English Wikipedia)
    fandom:<wiki>:<Page title>    the page's lead image on <wiki>.fandom.com
    pokeapi:<dex number>          the official artwork, via PokéAPI's sprite repository
    url:<https://...>|<credit>    any other picture, with its credit
    null                          no picture: the card prints a typographic placeholder

and writes each picture to public/cards/<league>/<slug>.jpg (or .png when it has transparency),
at most 720 px on its long side, unpressed (cards are glossy). Credits go in
src/features/cards/leagues/<league>.images.ts, which the card data imports. Already-fetched
pictures are kept unless their src changes or they're named in --force. --sheet draws a
labelled contact sheet of the league's pictures, for checking each shows the right subject.
"""

from __future__ import annotations

import html
import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
UA = "TheYayNews-cards/1.0 (personal project; card art fetcher)"
MAX = 720


def get(url: str, tries: int = 4) -> bytes:
    last: Exception | None = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            last = e
            code = getattr(e, "code", None)
            if code == 404:
                break
            time.sleep(1.5 * (i + 1) + (5 if code == 429 else 0))
    raise RuntimeError(f"GET {url}: {last}")


def api(base: str, **params: str) -> dict:
    q = urllib.parse.urlencode({**params, "format": "json", "formatversion": "2"})
    return json.loads(get(f"{base}?{q}"))


def strip(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", html.unescape(s or ""))
    return re.sub(r"\s+", " ", s).strip()


def short_licence(lic: str) -> str:
    lic = lic.replace("Public domain", "PD").replace("public domain", "PD")
    return lic.strip()


def file_info(title: str, wiki: str = "https://en.wikipedia.org/w/api.php") -> tuple[str, str]:
    """A file's 800 px thumbnail URL and a short credit."""
    if not title.startswith("File:"):
        title = f"File:{title}"
    d = api(wiki, action="query", titles=title, prop="imageinfo", iiprop="url|extmetadata",
            iiurlwidth="800")
    page = d["query"]["pages"][0]
    if "imageinfo" not in page:
        raise RuntimeError(f"no file {title}")
    info = page["imageinfo"][0]
    meta = info.get("extmetadata", {})
    artist = strip(meta.get("Artist", {}).get("value", ""))
    lic = short_licence(strip(meta.get("LicenseShortName", {}).get("value", "")))
    host = "Wikimedia Commons" if "commons" in info.get("descriptionurl", "") else "Wikipedia"
    if len(artist) > 40:
        artist = artist[:38].rstrip() + "…"
    bits = [b for b in (artist, lic) if b]
    credit = f"{host}" + (f" · {', '.join(bits)}" if bits else "")
    return info.get("thumburl") or info["url"], credit


def resolve(src: str) -> tuple[str, str]:
    kind, _, rest = src.partition(":")
    if kind == "wiki":
        d = api("https://en.wikipedia.org/w/api.php", action="query", titles=rest,
                prop="pageimages", piprop="name", pilicense="any", redirects="1")
        page = d["query"]["pages"][0]
        name = page.get("pageimage")
        if not name:
            raise RuntimeError(f"no lead image on {rest}")
        return file_info(name)
    if kind == "file":
        return file_info(rest)
    if kind == "fandom":
        sub, _, title = rest.partition(":")
        d = api(f"https://{sub}.fandom.com/api.php", action="query", titles=title,
                prop="pageimages", piprop="original", redirects="1")
        page = d["query"]["pages"][0]
        url = page.get("original", {}).get("source")
        if not url:
            raise RuntimeError(f"no lead image on {sub}:{title}")
        name = sub.replace("-", " ").title()
        return url, f"{name} Fandom wiki"
    if kind == "pokeapi":
        n = int(rest)
        return (
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/"
            f"official-artwork/{n}.png",
            "Official artwork © The Pokémon Company, via PokéAPI",
        )
    if kind == "url":
        url, _, credit = rest.partition("|")
        return url, credit or urllib.parse.urlparse(url).netloc
    raise RuntimeError(f"unknown src {src}")


def save(data: bytes, out_base: Path) -> Path:
    im = Image.open(io.BytesIO(data))
    im.load()
    alpha = im.mode in ("RGBA", "LA", "P") and (
        "transparency" in im.info or im.mode in ("RGBA", "LA")
    )
    if alpha:
        im = im.convert("RGBA")
        if im.getextrema()[3][0] == 255:
            alpha = False
    im.thumbnail((MAX, MAX), Image.LANCZOS)
    for ext in (".jpg", ".png"):
        old = out_base.with_suffix(ext)
        if old.exists():
            old.unlink()
    if alpha:
        out = out_base.with_suffix(".png")
        im.save(out, optimize=True)
        if out.stat().st_size > 260_000:
            im.quantize(colors=255, method=Image.Quantize.FASTOCTREE).save(out, optimize=True)
    else:
        out = out_base.with_suffix(".jpg")
        im.convert("RGB").save(out, quality=82, optimize=True, progressive=True)
    return out


def ts_string(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def sheet(league: str, entries: list[dict], out: Path) -> None:
    folder = ROOT / "public" / "cards" / league
    cells = []
    for e in entries:
        f = next((folder / f"{e['slug']}{x}" for x in (".jpg", ".png")
                  if (folder / f"{e['slug']}{x}").exists()), None)
        cells.append((e["slug"], f))
    w, h, cols = 180, 230, 8
    rows = (len(cells) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * w, rows * h), "white")
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 13)
    except OSError:
        font = ImageFont.load_default()
    for i, (slug, f) in enumerate(cells):
        x, y = (i % cols) * w, (i // cols) * h
        if f:
            im = Image.open(f).convert("RGBA")
            im.thumbnail((w - 8, h - 30))
            bg = Image.new("RGBA", im.size, (235, 235, 235, 255))
            bg.alpha_composite(im)
            canvas.paste(bg.convert("RGB"), (x + 4, y + 4))
        else:
            draw.rectangle([x + 4, y + 4, x + w - 4, y + h - 30], outline="red", width=3)
        draw.text((x + 4, y + h - 24), slug[:24], fill="black", font=font)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out)
    print(f"sheet: {out}")


def main() -> None:
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)
    league = args[0]
    force: set[str] = set()
    sheet_out: Path | None = None
    if "--force" in args:
        force = set(args[args.index("--force") + 1].split(","))
    if "--sheet" in args:
        sheet_out = Path(args[args.index("--sheet") + 1])
    manifest = ROOT / "scripts" / "card-images" / f"{league}.json"
    lock_path = ROOT / "scripts" / "card-images" / f"{league}.lock.json"
    entries = json.loads(manifest.read_text())
    lock = json.loads(lock_path.read_text()) if lock_path.exists() else {}
    folder = ROOT / "public" / "cards" / league
    folder.mkdir(parents=True, exist_ok=True)
    failed = []
    for e in entries:
        slug, src = e["slug"], e.get("src")
        have = lock.get(slug)
        exists = any((folder / f"{slug}{x}").exists() for x in (".jpg", ".png"))
        if not src:
            lock.pop(slug, None)
            for x in (".jpg", ".png"):
                if (folder / f"{slug}{x}").exists():
                    (folder / f"{slug}{x}").unlink()
            continue
        if have and have.get("src") == src and exists and slug not in force:
            continue
        try:
            url, credit = resolve(src)
            out = save(get(url), folder / slug)
            lock[slug] = {"src": src, "file": out.name, "credit": credit}
            print(f"ok   {slug:28} {out.stat().st_size // 1024:4} KB  {credit}")
        except Exception as ex:  # noqa: BLE001
            failed.append(slug)
            lock.pop(slug, None)
            print(f"FAIL {slug:28} {ex}")
        time.sleep(1.2)
    known = {e["slug"] for e in entries}
    lock = {k: v for k, v in lock.items() if k in known}
    lock_path.write_text(json.dumps(lock, indent=1, ensure_ascii=False) + "\n")
    lines = [
        "// Generated by scripts/fetch_card_images.py from scripts/card-images/"
        f"{league}.json. Do not edit:",
        "// change the manifest and run the script again.",
        "",
        'import type { CardImage } from "../types.ts";',
        "",
        "export const images: Record<string, CardImage> = {",
    ]
    for e in entries:
        v = lock.get(e["slug"])
        if v:
            lines.append(
                f"  {ts_string(e['slug'])}: {{ src: {ts_string(f'/cards/{league}/' + v['file'])}, "
                f"credit: {ts_string(v['credit'])} }},"
            )
    lines += ["};", ""]
    (ROOT / "src" / "features" / "cards" / "leagues" / f"{league}.images.ts").write_text(
        "\n".join(lines)
    )
    total = sum(f.stat().st_size for f in folder.iterdir())
    print(f"{league}: {len(lock)}/{len(entries)} pictures, {total / 1e6:.1f} MB; failed: {failed}")
    if sheet_out:
        sheet(league, entries, sheet_out)


if __name__ == "__main__":
    main()
