import type { CSSProperties, ReactNode } from "react";
import { type Ctx, LABEL, MASCOT_INKS, type MascotInks, type MascotPose, VIEW } from "./parts";
import { AsleepScene } from "./poses/asleep";
import { ConfusedScene } from "./poses/confused";
import { DeliverScene } from "./poses/deliver";
import { LightsScene } from "./poses/lights";
import { OnPileScene } from "./poses/on-pile";
import { PeekScene } from "./poses/peek";
import { StandingScene } from "./poses/standing";
import "./mascot.css";

export { MASCOT_INKS, MASCOT_POSES, type MascotInks, type MascotPose } from "./parts";

const SCENES: Record<MascotPose, (p: { c: Ctx }) => ReactNode> = {
  standing: StandingScene,
  peek: PeekScene,
  deliver: DeliverScene,
  asleep: AsleepScene,
  "on-pile": OnPileScene,
  lights: LightsScene,
  confused: ConfusedScene,
};

/** Odin, the paper's husky, in one of his poses. */
export function Mascot({
  pose = "standing",
  inks: given,
  label,
  still,
  className,
  style,
}: {
  pose?: MascotPose;
  /** Recolour him (defaults read the kit's --rt-* inks for the cap and satchel). */
  inks?: Partial<MascotInks>;
  /** Overrides the description; pass "" to make him decorative. */
  label?: string;
  /** No idle animation. */
  still?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const c: Ctx = { k: { ...MASCOT_INKS, ...given }, w: 3.2 };
  const alt = label ?? LABEL[pose];
  const Scene = SCENES[pose];
  return (
    <svg
      viewBox={VIEW[pose]}
      className={`rt-odin rt-odin--${pose} ${still ? "rt-odin--still" : ""} ${className ?? ""}`}
      style={style}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      focusable="false"
      overflow="visible"
    >
      <Scene c={c} />
    </svg>
  );
}
