import type { Metadata } from "next";
import { League_Gothic, Libre_Caslon_Text } from "next/font/google";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Pip, type PipLook, type PipPose } from "@/app/mockups/site-a/_shared/pip";

export const metadata: Metadata = { title: "Site chrome · three directions" };

const gothic = League_Gothic({ subsets: ["latin"], variable: "--si-gothic" });
const serif = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--si-serif",
});

const SCREENS = [
  ["shutter", "Today · before 7"],
  ["today", "Today · reading"],
  ["done", "Today · finished"],
  ["pile", "Pile"],
  ["wall", "Wall"],
] as const;

const DIRECTIONS: {
  slug: string;
  name: string;
  look: PipLook;
  pose: PipPose;
  ground: string;
  pitch: string;
  ux: string;
}[] = [
  {
    slug: "site-a",
    name: "A · Paperboy's World",
    look: "marker",
    pose: "bike",
    ground: "#c9efdc",
    pitch:
      "The website is the room the paper lives in: a kiosk with a roller shutter, a desk, a stack by the beanbag, a bedroom wall with fairy lights. Ticket stubs for nav, a tear-off calendar, a till receipt.",
    ux: "Most calm. Every object does one job and says it in words; the paper gets the whole desk.",
  },
  {
    slug: "site-b",
    name: "B · Riso Zine Riot",
    look: "xerox",
    pose: "sleep",
    ground: "#ffcfdd",
    pitch:
      "Loud two-plate riso zine: ransom-note headings, toner noise, stickers slapped on, a mixtape J-card as the page-turner, a gig-poster stamp tour, a lost-cat flyer with tear-off share tabs.",
    ux: "Most energetic. Chaos lives at the edges; reading is plain black-on-paper grotesque.",
  },
  {
    slug: "site-c",
    name: "C · Saturday Cartoon",
    look: "toon",
    pose: "hang",
    ground: "#e0d2f6",
    pitch:
      "Mascot-led cartoon: inked comic panels, bubble letters, sound effects, chunky buttons with a base you press. Pip says what to do in a balloon, and reading is his paper round.",
    ux: "Most guided. Pip is the onboarding; the route is contents, progress and page-turner at once.",
  },
];

const POSES: PipPose[] = ["bike", "sleep", "sit", "hang", "confused"];

export default function SiteIndex() {
  return (
    <main className={`si ${gothic.variable} ${serif.variable}`}>
      <style>{`
        .si { min-height: 100vh; background: #efe8d8; color: #1b1714; font-family: var(--si-serif), Georgia, serif; padding: 40px 16px 80px; }
        .si a { color: inherit; }
        .si :focus-visible { outline: 3px solid #1b1714; outline-offset: 3px; }
        .si-wrap { max-width: 1200px; margin: 0 auto; }
        .si h1 { font-family: var(--si-gothic), Impact, sans-serif; font-weight: 400; font-size: clamp(48px, 7vw, 88px); line-height: .9; margin: 0; text-transform: uppercase; }
        .si-lede { max-width: 62ch; font-size: 18px; margin: 14px 0 34px; }
        .si-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 26px; }
        .si-dir { background: var(--g); padding: 20px; border: 2px solid #1b1714; display: grid; gap: 10px; align-content: start; }
        .si-dir:nth-child(1) { rotate: -0.6deg; } .si-dir:nth-child(2) { rotate: 0.5deg; } .si-dir:nth-child(3) { rotate: -0.3deg; }
        .si-dir h2 { margin: 0; font-family: var(--si-gothic), Impact, sans-serif; font-weight: 400; font-size: 38px; line-height: 1; text-transform: uppercase; }
        .si-dir .pip { width: 100%; height: 150px; }
        .si-dir p { margin: 0; }
        .si-ux { font-style: italic; }
        .si-dir ul { list-style: none; margin: 6px 0 0; padding: 0; display: grid; gap: 6px; }
        .si-dir li a { display: flex; align-items: center; min-height: 44px; padding: 0 12px; background: #fffaf0; border: 1.5px solid #1b1714; text-decoration: none; font-weight: 700; }
        .si-dir li a:hover { text-decoration: underline; }
        .si-open { font-weight: 700; }
        .si-pip { margin-top: 50px; }
        .si-pip h2 { font-family: var(--si-gothic), Impact, sans-serif; font-weight: 400; font-size: 44px; margin: 0 0 6px; text-transform: uppercase; }
        .si-sheet { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; background: #fffaf0; border: 2px solid #1b1714; padding: 16px; }
        .si-sheet .pip { width: 100%; height: 120px; }
        @media (max-width: 860px) { .si-grid { grid-template-columns: minmax(0, 1fr); } .si-sheet { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      `}</style>
      <div className="si-wrap">
        <h1>The website around the paper · three directions</h1>
        <p className="si-lede">
          Each is its own system (type, colour roles, components, motion) driven by the day&rsquo;s
          colourway, with the real paper printed inside it and real editions, stamps and recaps from
          the API and the habit rules. Same screens in each, so they compare one to one. Add{" "}
          <code>?cw=tropic-punch</code> (or any colourway slug) to see a neon day.
        </p>
        <div className="si-grid">
          {DIRECTIONS.map((d) => (
            <section
              key={d.slug}
              className="si-dir"
              style={{ "--g": d.ground } as CSSProperties}
              aria-labelledby={`${d.slug}-h`}
            >
              <h2 id={`${d.slug}-h`}>{d.name}</h2>
              <Pip pose={d.pose} look={d.look} label="" />
              <p>{d.pitch}</p>
              <p className="si-ux">{d.ux}</p>
              <Link href={`/mockups/${d.slug}`} className="si-open">
                Rationale and system
              </Link>
              <ul>
                {SCREENS.map(([s, label]) => (
                  <li key={s}>
                    <Link href={`/mockups/${d.slug}/${s}`}>{label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <section className="si-pip" aria-labelledby="pip-h">
          <h2 id="pip-h">Pip, the paper&rsquo;s pigeon</h2>
          <p className="si-lede">
            One character model, hand-authored SVG, five poses, drawn in each direction&rsquo;s pen:
            fine marker with a riso shadow plate (A), photocopied two-plate (B), chunky cartoon ink
            (C). Idle life is a blink, a head-bob and a per-pose loop, all off for reduced motion.
          </p>
          {(["marker", "xerox", "toon"] as PipLook[]).map((look) => (
            <div key={look} className="si-sheet" style={{ marginBottom: 10 }}>
              {POSES.map((p) => (
                <Pip key={p} pose={p} look={look} />
              ))}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
