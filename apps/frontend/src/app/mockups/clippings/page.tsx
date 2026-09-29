import type { Metadata } from "next";
import { Courier_Prime, Libre_Franklin } from "next/font/google";
import { FORMATS, type Format } from "@/app/clip/_lib/clipping";
import { LOOK_NAMES, LOOKS, type LookId } from "@/app/clip/_lib/looks";
import { allStories } from "@/app/mockups/_data/sample-edition";
import { pastels } from "@/features/print/colourways/pastels";
import { themes } from "@/features/print/colourways/themes";
import "../colours/colours.css";
import "./clippings.css";

const sans = Libre_Franklin({ subsets: ["latin"], variable: "--cp-sans" });
const mono = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--cp-mono" });

export const metadata: Metadata = { title: "Clippings · The Yay News" };

const FORMAT_LABELS: Record<Format, string> = {
  story: "Stories 1080×1920",
  post: "Feed post 1080×1350",
  link: "Link preview 1200×630",
};

const SUBJECTS = [
  { slug: "front", title: "The front page" },
  ...["dancing-octopus", "bread-and-butter"].map((slug) => ({
    slug,
    title: allStories.find((s) => s.slug === slug)?.headline ?? slug,
  })),
];

const clipUrl = (format: Format, story: string, look: LookId, extra = "") =>
  `/clip/${format}?story=${story}&look=${look}${extra}`;

function Proof({ format, src, label }: { format: Format; src: string; label: string }) {
  const { w, h } = FORMATS[format];
  return (
    <figure className={`cl-proof cl-${format}`}>
      {/* The route's own PNG, exactly as a reader would share it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={w} height={h} loading="lazy" />
      <figcaption className="cp-mono">
        {label} ·{" "}
        <a href={src} target="_blank" rel="noreferrer">
          open PNG
        </a>
      </figcaption>
    </figure>
  );
}

export default function Clippings() {
  const formats = Object.keys(FORMATS) as Format[];
  return (
    <main className={`${sans.variable} ${mono.variable} cp-desk`}>
      <div className="cp-wrap">
        <p className="cp-mono cp-kicker">The Yay News · clipping proofs</p>
        <h1>Clippings</h1>
        <p className="cp-intro">
          Every story and the front page, torn out of the paper and taped down, in the three sizes a
          reader shares: Stories, feed posts and the link preview. Each image is drawn on the server
          by <code className="cp-mono">/clip/[format]</code> and cached; change{" "}
          <code className="cp-mono">look</code>, <code className="cp-mono">theme</code> or{" "}
          <code className="cp-mono">pastel</code> in any URL to try another print.
        </p>

        {SUBJECTS.map((s) => (
          <section key={s.slug}>
            <h2 className="cp-family">{s.title}</h2>
            {LOOKS.map((look) => (
              <div key={look} className="cl-look">
                <h3>
                  {look} · {LOOK_NAMES[look]}
                </h3>
                <div className="cl-row">
                  {formats.map((f) => (
                    <Proof
                      key={f}
                      format={f}
                      src={clipUrl(f, s.slug, look)}
                      label={FORMAT_LABELS[f]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}

        <h2 className="cp-family">Colourways</h2>
        <p className="cp-intro">
          The same feed post in five of the broadsheet&apos;s kept colourways (
          <code className="cp-mono">?theme=</code>) and in each pastel set on the Tabloid, Mini Zine
          and Midi Magazine (<code className="cp-mono">?pastel=</code>).
        </p>
        <div className="cl-look">
          <h3>v1 · {LOOK_NAMES.v1}</h3>
          <div className="cl-row">
            {themes
              .filter((t) => t.kept)
              .slice(0, 5)
              .map((t) => (
                <Proof
                  key={t.slug}
                  format="post"
                  src={clipUrl("post", "dancing-octopus", "v1", `&theme=${t.slug}`)}
                  label={t.name}
                />
              ))}
          </div>
        </div>
        {(["v3", "v4", "v5"] as const).map((look) => (
          <div key={look} className="cl-look">
            <h3>
              {look} · {LOOK_NAMES[look]}
            </h3>
            <div className="cl-row">
              {pastels.map((p) => (
                <Proof
                  key={p.slug}
                  format="post"
                  src={clipUrl("post", "village-choir-power-ballad", look, `&pastel=${p.slug}`)}
                  label={p.name}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
