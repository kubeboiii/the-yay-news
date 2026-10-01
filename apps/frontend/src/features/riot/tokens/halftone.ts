import { r1, rand } from "./seed";

// A real-feeling halftone screen: dots on a screen angle, each dot's size set by the tone at that
// spot (area ∝ tone), with a little jitter in place and size and a slow wobble in ink density, the
// way a cheap screen on a riso drum actually prints. Returned as one SVG path of circles.

export type Fade = "left" | "right" | "up" | "down" | "radial" | "corner" | "flat";

const TONE: Record<Fade, (x: number, y: number) => number> = {
  left: (x) => 1 - x,
  right: (x) => x,
  up: (_, y) => 1 - y,
  down: (_, y) => y,
  radial: (x, y) => Math.max(0, 1 - Math.hypot(x - 0.5, y - 0.5) * 1.9),
  corner: (x, y) => Math.max(0, 1 - Math.hypot(1 - x, 1 - y) * 0.95),
  flat: () => 1,
};

export function halftonePath({
  w = 320,
  h = 220,
  pitch = 8,
  angle = 15,
  fade = "corner",
  density = 0.75,
  seed = "dots",
}: {
  w?: number;
  h?: number;
  pitch?: number;
  angle?: number;
  fade?: Fade;
  density?: number;
  seed?: string;
}): string {
  const r = rand(`halftone:${seed}`);
  const ph = [r() * 6, r() * 6, r() * 6];
  // Ink density drifts across the sheet: a couple of slow sine waves, seeded.
  const ink = (x: number, y: number) =>
    0.82 +
    0.12 * Math.sin(x * 5.1 + ph[0]!) * Math.cos(y * 4.3 + ph[1]!) +
    0.06 * Math.sin((x + y) * 9 + ph[2]!);
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const span = Math.hypot(w, h);
  const out: string[] = [];
  for (let u = -span; u < span; u += pitch) {
    for (let v = -span; v < span; v += pitch) {
      const x = w / 2 + u * cos - v * sin + (r() - 0.5) * pitch * 0.16;
      const y = h / 2 + u * sin + v * cos + (r() - 0.5) * pitch * 0.16;
      if (x < -pitch || y < -pitch || x > w + pitch || y > h + pitch) continue;
      const tone = Math.min(1, Math.max(0, TONE[fade](x / w, y / h) * density * ink(x / w, y / h)));
      const d = pitch * Math.sqrt(tone / Math.PI) * (0.92 + r() * 0.16);
      if (d < 0.45) continue;
      const rr = r1(d);
      out.push(
        `M${r1(x - d)} ${r1(y)}a${rr} ${rr} 0 1 0 ${r1(2 * d)} 0a${rr} ${rr} 0 1 0 ${r1(-2 * d)} 0`,
      );
    }
  }
  return out.join("");
}
