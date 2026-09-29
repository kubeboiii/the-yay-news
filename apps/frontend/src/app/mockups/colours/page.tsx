import type { Metadata } from "next";
import { Courier_Prime, Libre_Franklin } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { type Pastel, pastels } from "@/features/print/colourways/pastels";
import { overprint, type Theme, themes } from "@/features/print/colourways/themes";
import "./colours.css";

const sans = Libre_Franklin({ subsets: ["latin"], variable: "--cp-sans" });
const mono = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--cp-mono" });

export const metadata: Metadata = { title: "Colourways · The Yay News" };

const paperParam = (t: Theme) => (t.paper === "bright" ? "white" : "newsprint");

function Proof({ t, n }: { t: Theme; n: number }) {
  const href = `/mockups/v1?theme=${t.slug}&paper=${paperParam(t)}`;
  const [a, b] = [t.inks[0]?.hex ?? "#000000", t.inks[1]?.hex ?? "#000000"];
  return (
    <article
      className={`cp-proof${t.kept ? "cp-kept" : ""}`}
      style={{ "--a": a, "--b": b } as React.CSSProperties}
    >
      <header className="cp-head">
        <p className="cp-no">
          {String(n).padStart(2, "0")} · {t.family}
          {t.kept ? <span className="cp-kept-tag"> · kept</span> : null}
        </p>
        <h2>{t.name}</h2>
        <p className="cp-story">{t.story}</p>
      </header>

      <div className="cp-inks">
        {t.inks.map((ink) => (
          <div key={ink.name} className="cp-ink">
            <span className="cp-chip" style={{ background: ink.hex }} />
            <div>
              <p className="cp-ink-name">{ink.name}</p>
              <p className="cp-mono">
                {ink.hex} · {ink.ref}
              </p>
              <p className="cp-role">{ink.role}</p>
            </div>
          </div>
        ))}
        <div className="cp-ink">
          <span className="cp-chip cp-over">
            <span style={{ background: a }} />
            <span style={{ background: b }} />
          </span>
          <div>
            <p className="cp-ink-name">Overprint</p>
            <p className="cp-mono">{overprint(a, b)} where they overlap</p>
            <p className="cp-role">Shadows, misregistration, duotone darks</p>
          </div>
        </div>
      </div>

      <div className="cp-ramps" aria-hidden>
        {t.inks.slice(0, 2).map((ink) => (
          <div key={ink.name} className="cp-ramp">
            {[100, 70, 40, 20].map((p) => (
              <span key={p} style={{ background: `color-mix(in srgb, ${ink.hex} ${p}%, #fbf8f1)` }}>
                {p}%
              </span>
            ))}
          </div>
        ))}
        {t.deep ? (
          <div className="cp-ramp cp-deep">
            {t.deep.map((d) => (
              <span key={d} style={{ background: d }}>
                {d}
              </span>
            ))}
            <em>deep tones for type</em>
          </div>
        ) : null}
      </div>

      <Link href={href} className="cp-previews" aria-label={`Open ${t.name} on the broadsheet`}>
        <span className="cp-preview">
          <Image
            src={`/mockup/press/themes/${t.slug}.jpg`}
            alt={`Front page in ${t.name}`}
            fill
            sizes="240px"
            className="object-cover object-top"
          />
        </span>
        <span className="cp-preview">
          <Image
            src={`/mockup/press/themes/${t.slug}-g.jpg`}
            alt={`Gaming page in ${t.name}`}
            fill
            sizes="240px"
            className="object-cover object-top"
          />
        </span>
      </Link>

      <footer className="cp-foot">
        <p>
          <strong>Best for:</strong> {t.best}
        </p>
        <p className="cp-mono">
          Paper: {t.paper === "bright" ? "bright white stock" : "newsprint"}
        </p>
        <Link href={href} className="cp-open">
          Open on the broadsheet →
        </Link>
      </footer>
    </article>
  );
}

const VERSIONS = [
  { v: "v3", name: "Tabloid" },
  { v: "v4", name: "Mini Zine" },
  { v: "v5", name: "Midi Magazine" },
];

function PastelProof({ p, n }: { p: Pastel; n: number }) {
  const [a, b] = [p.inks[0]!.soft, (p.inks[1] ?? p.inks[0]!).soft];
  return (
    <article className="cp-proof" style={{ "--a": a, "--b": b } as React.CSSProperties}>
      <header className="cp-head">
        <p className="cp-no">
          {String(n).padStart(2, "0")} · Pastel · {p.inks.length} inks
        </p>
        <h2 style={{ color: p.ink }}>{p.name}</h2>
        <p className="cp-story">{p.story}</p>
      </header>

      <div className="cp-inks">
        {p.inks.map((ink) => (
          <div key={ink.name} className="cp-ink cp-ink--pz">
            <span className="cp-chip" style={{ background: ink.soft }} />
            <span className="cp-chip cp-chip--deep" style={{ background: ink.deep }} />
            <div>
              <p className="cp-ink-name">{ink.name}</p>
              <p className="cp-mono">
                {ink.soft} · deep {ink.deep}
              </p>
            </div>
          </div>
        ))}
        <div className="cp-ink cp-ink--pz">
          <span className="cp-chip" style={{ background: p.ink }} />
          <span />
          <div>
            <p className="cp-ink-name">Ink</p>
            <p className="cp-mono">{p.ink} · every word</p>
          </div>
        </div>
      </div>

      <div className="cp-pz-previews">
        {VERSIONS.map(({ v, name }) => (
          <Link key={v} href={`/mockups/${v}?pastel=${p.slug}`} className={`cp-pz-${v}`}>
            <Image
              src={`/mockup/press/pastels/${p.slug}-${v}.jpg`}
              alt={`${name} front in ${p.name}`}
              width={1000}
              height={700}
              sizes="320px"
              className="cp-pz-img"
            />
            <span className="cp-mono">{name} →</span>
          </Link>
        ))}
      </div>

      <footer className="cp-foot">
        <p>
          <strong>Best for:</strong> {p.best}
        </p>
      </footer>
    </article>
  );
}

export default function Colours() {
  const kept = themes.filter((t) => t.slug === "original" || t.inks.length <= 2);
  const neon = themes.filter((t) => t.slug !== "original" && t.inks.length > 2);
  return (
    <main className={`${sans.variable} ${mono.variable} cp-desk`}>
      <div className="cp-wrap">
        <p className="cp-mono cp-kicker">The Yay News · colour proofs for the broadsheet</p>
        <h1>Broadsheet colourways</h1>
        <p className="cp-intro">
          Spot inks plus black, printed on the broadsheet (v1). Open any proof to see it on all four
          pages, or switch colourways from the <em>Colours</em> menu in the page switcher.
        </p>
        <h2 className="cp-family">The original and two-ink sets</h2>
        <div className="cp-grid">
          {kept.map((t, i) => (
            <Proof key={t.slug} t={t} n={i + 1} />
          ))}
        </div>
        <h2 className="cp-family">Three-ink and more (a different pair for every section)</h2>
        <div className="cp-grid">
          {neon.map((t, i) => (
            <Proof key={t.slug} t={t} n={kept.length + i + 1} />
          ))}
        </div>
        <h2 className="cp-family" id="pastels">
          Pastels for the Tabloid (v3), Mini Zine (v4) and Midi Magazine (v5)
        </h2>
        <p className="cp-intro">
          Soft inks, each with a deeper tone of itself for type, rules and stickers. Some swap the
          black plate for a brown, plum or green-black. Switch them from the <em>Pastels</em> menu
          on any of the three versions.
        </p>
        <div className="cp-grid">
          {pastels.map((p, i) => (
            <PastelProof key={p.slug} p={p} n={i + 1} />
          ))}
        </div>
      </div>
    </main>
  );
}
