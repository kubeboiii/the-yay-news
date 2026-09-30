"""Turn a photo into how it looks printed on newsprint: muted, lifted blacks, a fine CMYK dot screen."""
import sys, math
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

def screen(ch, cell, angle, ss=3, gain=1.0):
    """Dots on a lattice rotated by `angle`, sized by ink coverage, drawn without rotating the image."""
    w, h = ch.size
    px = ch.load()
    out = Image.new("L", (w*ss, h*ss), 0)
    d = ImageDraw.Draw(out)
    a = math.radians(angle); ca, sa = math.cos(a), math.sin(a)
    n = int(math.hypot(w, h) / cell) + 2
    for i in range(-n, n):
        for j in range(-n, n):
            x = (i*ca - j*sa) * cell + w/2
            y = (i*sa + j*ca) * cell + h/2
            if not (-cell <= x < w+cell and -cell <= y < h+cell): continue
            v = px[min(max(int(x),0),w-1), min(max(int(y),0),h-1)] / 255.0
            if v < 0.02: continue
            r = math.sqrt(v) * cell * 0.62 * gain * ss
            X, Y = x*ss, y*ss
            d.ellipse((X-r, Y-r, X+r, Y+r), fill=255)
    return out.resize((w, h), Image.LANCZOS)

def press(src, dst, width=1600, cell=3.0, mix=0.22):
    # Clearer since 2026-10-01 (owner: "make images a little more clearer"): a finer, lighter dot
    # screen, truer colour and blacks, and no blur, so the photo still reads as printed but the
    # subject is sharp.
    im = Image.open(src).convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height*width/im.width)), Image.LANCZOS)
    # Newsprint can't hold deep blacks or full saturation: lift the floor a little.
    im = ImageEnhance.Color(im).enhance(0.96)
    im = ImageEnhance.Contrast(im).enhance(0.98)
    lut = [round(12 + v*(250-12)/255) for v in range(256)]
    im = im.point(lut*3)
    c, m, y, k = im.convert("CMYK").split()
    dots = Image.merge("CMYK", (screen(c, cell, 15), screen(m, cell, 75), screen(y, cell, 0), screen(k, cell, 45))).convert("RGB")
    out = Image.blend(im, dots, mix).filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))
    out.save(dst, quality=86, optimize=True, progressive=True)

if __name__ == "__main__":
    press(sys.argv[1], sys.argv[2], cell=float(sys.argv[3]) if len(sys.argv) > 3 else 4.0)
