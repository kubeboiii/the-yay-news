import type { CSSProperties } from "react";
import { Burst } from "@/features/print/burst";
import { Mark } from "@/features/print/mark";

// The stickers' printed faces: glossy vinyl in bright process inks, built from the print kit's
// Burst shapes and the real hand-drawn marks in public/mockup/marks. Each face fills its box; the
// white vinyl margin and die-cut line come from .hb-vinyl round it.
// (Adapted from the Phase 1 insert stickers in app/mockups/_shared/inserts/stickers.tsx.)

export const VINYL = {
  yellow: "#ffd23f",
  pink: "#ff5fa2",
  blue: "#3d7bff",
  green: "#3ccf7a",
  orange: "#ff7a2f",
  sky: "#8fd3ff",
  butter: "#fff0a6",
  ink: "#1d1a17",
};

const type = (size: number, extra?: CSSProperties): CSSProperties => ({
  fontFamily: "var(--hb-gothic), Impact, sans-serif",
  fontSize: `${size}cqw`,
  lineHeight: 0.86,
  color: VINYL.ink,
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  display: "block",
  ...extra,
});

export function StickerArt({ id, issue }: { id: string; issue?: number }) {
  switch (id) {
    case "good-news":
      return (
        <Burst fill={VINYL.pink} points={22} depth={0.13} className="hb-st-fill">
          <span style={type(20)}>
            Good
            <br />
            news
            <br />
            only
          </span>
        </Burst>
      );
    case "yay":
      return (
        <span className="hb-st-pill" style={{ background: VINYL.yellow }}>
          <span style={type(46, { letterSpacing: "0.04em" })}>Yay!</span>
        </span>
      );
    case "issue":
      return (
        <Burst fill={VINYL.blue} points={11} depth={0.12} wobble={1} className="hb-st-fill">
          <span style={type(30, { color: "#fff" })}>
            <small style={{ display: "block", fontSize: "0.5em" }}>No.</small>
            {issue ?? ""}
          </span>
        </Burst>
      );
    case "heart":
      return <Mark name="stars-15" ink={VINYL.pink} className="hb-st-fill" />;
    case "finished":
      return (
        <span className="hb-st-label">
          <Mark name="stars-04" ink={VINYL.ink} className="hb-st-label__star" />
          <span style={type(17, { textAlign: "left", lineHeight: 0.9 })}>Finished it!</span>
        </span>
      );
    case "smile":
      return (
        <span className="hb-st-dot" style={{ background: VINYL.yellow }}>
          <Mark name="doodles-06" ink={VINYL.ink} className="hb-st-dot__mark" />
        </span>
      );
    case "star":
      return <Mark name="stars-21" ink="#f4b400" className="hb-st-fill" />;
    case "full-set":
      return (
        <Burst fill={VINYL.orange} points={16} depth={0.16} className="hb-st-fill">
          <span style={type(22, { color: VINYL.ink })}>
            Full
            <br />
            set!
          </span>
        </Burst>
      );
    case "hi":
      return (
        <span className="hb-st-dot" style={{ background: VINYL.green }}>
          <Mark name="sketch-09" ink={VINYL.ink} className="hb-st-dot__mark hb-st-dot__mark--hi" />
        </span>
      );
    case "bee":
      return (
        <span className="hb-st-dot hb-st-dot--oval" style={{ background: VINYL.butter }}>
          <Mark name="sketch-18" ink={VINYL.ink} className="hb-st-dot__mark" />
        </span>
      );
    case "rainbow":
      return (
        <span className="hb-st-rainbow" style={{ background: VINYL.sky }}>
          <Mark
            name="stars-18"
            ink="#ff4d4d"
            className="hb-st-rainbow__band hb-st-rainbow__band--1"
          />
          <Mark
            name="stars-18"
            ink={VINYL.orange}
            className="hb-st-rainbow__band hb-st-rainbow__band--2"
          />
          <Mark
            name="stars-18"
            ink={VINYL.yellow}
            className="hb-st-rainbow__band hb-st-rainbow__band--3"
          />
          <Mark name="stars-20" ink="#ffffff" className="hb-st-rainbow__cloud" />
        </span>
      );
    default:
      return <Mark name="stars-02" ink={VINYL.orange} className="hb-st-fill" />;
  }
}
