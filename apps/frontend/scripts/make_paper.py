"""Build the newsprint sheets the mockups print on.

The result is multiplied over each page, so whites become the paper colour and every ink picks up
the fibres. Baked into the sheet: real paper grain from a scanned recycled sheet, a faint mirrored
show-through of a reverse page (thin newsprint is never opaque), soft light falloff and slightly
toned edges.

    python3 scripts/make_paper.py <texture.jpg> <reverse-page.jpg> <out-dir>
"""

import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter, ImageOps

W, H = 2000, 3000


def cover(im: Image.Image, w: int, h: int) -> Image.Image:
    scale = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left, top = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((left, top, left + w, top + h))


def fibres(texture: Image.Image, lo: float, hi: float) -> Image.Image:
    """Grain as a luminance map around 1.0, clamped so fibres read without muddying the page."""
    grey = ImageOps.grayscale(cover(texture, W, H))
    mean = sum(i * n for i, n in enumerate(grey.histogram())) / (W * H)
    return grey.point(lambda v: round(255 * min(hi, max(lo, v / mean)) / hi))


def radial(strength: float) -> Image.Image:
    """1.0 in the middle falling to (1 - strength) in the corners."""
    small = Image.new("L", (200, 300))
    px = small.load()
    for y in range(300):
        for x in range(200):
            dx, dy = (x - 100) / 100, (y - 150) / 150
            d = min(1.0, (dx * dx + dy * dy) ** 0.5 / 1.25)
            px[x, y] = round(255 * (1 - strength * d * d))
    return small.resize((W, H), Image.BICUBIC)


def show_through(reverse: Image.Image, strength: float) -> Image.Image:
    """The reverse page seen faintly through the sheet: mirrored, blurred, very light."""
    ghost = ImageOps.mirror(ImageOps.grayscale(cover(reverse, W, H)))
    ghost = ghost.filter(ImageFilter.GaussianBlur(3))
    return ghost.point(lambda v: round(255 * (1 - strength * (1 - v / 255))))


def sheet(texture, reverse, colour, grain, ghost, falloff, out: Path):
    base = Image.new("RGB", (W, H), colour)
    lum = fibres(texture, *grain)
    for layer in (lum, show_through(reverse, ghost), radial(falloff)):
        base = ImageChops.multiply(base, Image.merge("RGB", (layer, layer, layer)))
    # Edges tone warmer where the sheet has been handled and caught the light.
    edge = radial(0.2).point(lambda v: 255 - round((255 - v) * 0.25))
    warm = Image.merge("RGB", (Image.new("L", (W, H), 255), edge.point(lambda v: 255 - (255 - v) // 3), edge))
    base = ImageChops.multiply(base, warm)
    base.save(out, quality=82, optimize=True, progressive=True)
    print(out, f"{out.stat().st_size // 1024} KB")


def light_map(w: int, h: int, spread: bool) -> Image.Image:
    """Soft-light shading that makes a flat page read as a physical sheet.

    Mid-grey is neutral. A slow diagonal wave says the paper isn't perfectly flat, the bottom corners
    catch the light where they curl up, and a spread gets a dark valley at the gutter with the pages
    swelling up on either side of it.
    """
    import math

    sw, sh = w // 4, h // 4
    im = Image.new("L", (sw, sh))
    px = im.load()
    for y in range(sh):
        for x in range(sw):
            u, v = x / sw, y / sh
            val = 128.0
            val += 9 * math.sin(2 * math.pi * (0.55 * u + 0.85 * v) * 1.2 + 0.6)  # gentle wave
            val += 10 * (0.5 - v) * 0.6 + 6 * (0.5 - u) * 0.4  # light from the top left
            for cx in (0.0, 1.0):  # bottom corners lifting
                d = math.hypot(u - cx, (v - 1.0) * 0.8)
                if d < 0.22:
                    t = 1 - d / 0.22
                    val += 22 * t * t
            if spread:
                g = abs(u - 0.5)
                val -= 60 * math.exp(-((g / 0.012) ** 2))  # gutter valley
                val += 16 * math.exp(-(((g - 0.05) / 0.035) ** 2))  # pages swelling beside it
                val -= 10 * (g / 0.5) ** 2  # falling away towards the outer edges
            px[x, y] = max(0, min(255, round(val)))
    return im.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2))


if __name__ == "__main__":
    texture = Image.open(sys.argv[1]).convert("RGB")
    reverse = Image.open(sys.argv[2]).convert("RGB")
    out = Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    # Standard newsprint: cream-grey, visible fibres, a little show-through.
    sheet(texture, reverse, (240, 235, 224), (0.86, 1.04), 0.03, 0.05, out / "newsprint.jpg")
    # Bright stock: whiter and smoother, less show-through.
    sheet(texture, reverse, (249, 247, 243), (0.92, 1.03), 0.018, 0.035, out / "newsprint-bright.jpg")
    # White stock, for comparing against newsprint: neutral white, faint fibres, almost no toning.
    sheet(texture, reverse, (254, 254, 252), (0.95, 1.02), 0.012, 0.025, out / "newsprint-white.jpg")
    light_map(1200, 1800, spread=False).save(out / "light-sheet.png", optimize=True)
    light_map(2400, 1800, spread=True).save(out / "light-spread.png", optimize=True)
    print("light maps written")
