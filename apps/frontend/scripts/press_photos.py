"""Print every mockup photo onto newsprint.

Reads the Unsplash ids in src/app/mockups/_data/photos.ts, downloads each one once, runs it through
the halftone press and writes public/mockup/press/<id>.jpg. The photo helper serves a pressed file
when one exists and falls back to the CDN otherwise, so this can be rerun at any time.

    python3 scripts/press_photos.py
"""

import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from press_lib import press  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "src/app/mockups/_data/photos.ts"
OUT = ROOT / "public/mockup/press"
RAW = OUT / "raw"

# The paper texture is laid over the sheet as-is; screening it would print dots on the paper.
SKIP = {"photo-1712145176570-6cb1d98a126a"}


def main() -> None:
    ids = sorted(set(re.findall(r'"(photo-[0-9a-f-]+(?:-v2)?)"', PHOTOS.read_text())) - SKIP)
    RAW.mkdir(parents=True, exist_ok=True)
    done = []
    for pid in ids:
        raw, dst = RAW / f"{pid}.jpg", OUT / f"{pid}.jpg"
        if not raw.exists():
            url = f"https://images.unsplash.com/{pid}?w=1600&q=90&fm=jpg"
            urllib.request.urlretrieve(url, raw)
        if not dst.exists() or dst.stat().st_mtime < raw.stat().st_mtime:
            press(str(raw), str(dst))
        done.append(pid)
        print(f"{pid}  {dst.stat().st_size // 1024} KB")
    print(f"{len(done)} photos pressed")


if __name__ == "__main__":
    main()
