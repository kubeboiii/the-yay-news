// The room light over the desk, following the reader's clock. Morning sun comes in low and warm
// from the east (the right of the desk), so the sheet's shadow falls long to the left; midday is
// neutral and flat; evening is amber lamp light from the west; night is cool and dim.

export type Light = {
  name: "morning" | "midday" | "afternoon" | "evening" | "night";
  /** Tint gradient multiplied over the desk and paper. */
  tint: string;
  opacity: number;
  /** Contact shadow: horizontal and vertical offset (px), stretch, and strength. */
  shadowX: number;
  shadowY: number;
  shadowStretch: number;
  shadowStrength: number;
};

export function lightFor(hour: number): Light {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  if (h >= 5 && h < 10) {
    return {
      name: "morning",
      tint: "radial-gradient(ellipse 120% 90% at 105% 10%, rgb(255 214 150), rgb(255 226 188) 45%, rgb(236 222 204) 100%)",
      opacity: 0.2,
      shadowX: -16,
      shadowY: 6,
      shadowStretch: 1.5,
      shadowStrength: 0.85,
    };
  }
  if (h >= 10 && h < 16) {
    return {
      name: "midday",
      tint: "linear-gradient(rgb(255 255 255), rgb(255 255 255))",
      opacity: 0,
      shadowX: 0,
      shadowY: 0,
      shadowStretch: 1,
      shadowStrength: 1,
    };
  }
  if (h >= 16 && h < 18) {
    return {
      name: "afternoon",
      tint: "radial-gradient(ellipse 120% 90% at -5% 15%, rgb(255 236 206), rgb(250 240 226) 60%, rgb(240 234 226))",
      opacity: 0.14,
      shadowX: 8,
      shadowY: 3,
      shadowStretch: 1.2,
      shadowStrength: 0.95,
    };
  }
  if (h >= 18 && h < 23) {
    return {
      name: "evening",
      tint: "radial-gradient(ellipse 110% 90% at -5% 20%, rgb(255 196 120), rgb(236 186 128) 50%, rgb(196 160 124) 100%)",
      opacity: 0.2,
      shadowX: 14,
      shadowY: 5,
      shadowStretch: 1.35,
      shadowStrength: 0.9,
    };
  }
  return {
    name: "night",
    tint: "radial-gradient(ellipse 90% 80% at 50% 30%, rgb(214 222 238), rgb(170 182 206) 70%, rgb(150 160 186) 100%)",
    opacity: 0.22,
    shadowX: 0,
    shadowY: 2,
    shadowStretch: 1.1,
    shadowStrength: 0.7,
  };
}

/** The reader's local hour, or `?hour=N` for previewing another time of day. */
export function currentHour(): number {
  const raw = new URLSearchParams(window.location.search).get("hour");
  const n = raw === null ? Number.NaN : Number(raw);
  if (Number.isFinite(n) && n >= 0 && n < 24) return n;
  return new Date().getHours();
}
