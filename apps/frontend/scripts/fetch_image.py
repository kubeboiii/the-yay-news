"""Fetch an image for a sample edition story and press it onto newsprint.

    python3 apps/frontend/scripts/fetch_image.py <image-url> <issue> <story-slug>

Writes apps/frontend/public/editions/<issue>/<story-slug>.jpg (the pressed print, 1200px wide) and
prints the site path to use as the story's `image.file` in the seed data.
"""
import os, sys, tempfile, urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image  # noqa: E402
from press_lib import press  # noqa: E402

url, issue, slug = sys.argv[1], sys.argv[2], sys.argv[3]
root = os.path.join(os.path.dirname(__file__), "..", "public", "editions", issue)
os.makedirs(root, exist_ok=True)
dst = os.path.join(root, f"{slug}.jpg")

req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (the-yay-news sample fetch)"})
with urllib.request.urlopen(req, timeout=30) as r, tempfile.NamedTemporaryFile(suffix=".img", delete=False) as f:
    f.write(r.read())
    raw = f.name
press(raw, dst, width=1200)
os.unlink(raw)
# Sample images are committed with the seed data, so keep them small.
Image.open(dst).save(dst, quality=74, optimize=True, progressive=True)
print(f"/editions/{issue}/{slug}.jpg")
