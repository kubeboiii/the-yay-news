"""Fetch an image for a sample edition story and press it onto newsprint.

    python3 apps/frontend/scripts/fetch_image.py <image-url> <issue> <story-slug> [min-width]

Writes apps/frontend/public/editions/<issue>/<story-slug>.jpg (the pressed print, 1600px wide) and
prints the site path to use as the story's `image.file` in the seed data. With a min-width, a
picture narrower than that is refused (exit 3) rather than pressed: the newsroom uses it to skip
thumbnails.
"""
import os, sys, tempfile, urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image  # noqa: E402
from press_lib import press  # noqa: E402

url, issue, slug = sys.argv[1], sys.argv[2], sys.argv[3]
min_width = int(sys.argv[4]) if len(sys.argv) > 4 else 0
root = os.path.join(os.path.dirname(__file__), "..", "public", "editions", issue)
os.makedirs(root, exist_ok=True)
dst = os.path.join(root, f"{slug}.jpg")

# Some image CDNs refuse anything that does not look like a browser loading the page.
origin = "/".join(url.split("/")[:3])
req = urllib.request.Request(url, headers={
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/jpeg,image/png,*/*;q=0.8",
    "Referer": origin + "/",
})
with urllib.request.urlopen(req, timeout=30) as r, tempfile.NamedTemporaryFile(suffix=".img", delete=False) as f:
    f.write(r.read())
    raw = f.name
if min_width:
    with Image.open(raw) as probe:
        if probe.width < min_width:
            os.unlink(raw)
            print(f"too narrow: {probe.width}px < {min_width}px", file=sys.stderr)
            sys.exit(3)
press(raw, dst, width=1600)
os.unlink(raw)
# Sample images are committed with the seed data, so keep them small.
Image.open(dst).save(dst, quality=82, optimize=True, progressive=True)
print(f"/editions/{issue}/{slug}.jpg")
