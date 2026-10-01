"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Props = {
  url: string;
  headline: string;
  dek: string;
  /** The 1080×1920 clipping, for Stories. */
  storyImage: string;
  /** The 1080×1350 clipping, for feed posts and pins. */
  postImage: string;
  /** Download name, without extension. */
  fileName: string;
  qr: { size: number; d: string };
};

// Web Share API level 2: can this browser hand an image file to the share sheet (and so to
// Instagram's own editor)? Phones mostly can; desktops mostly can't.
let filesShareable: boolean | undefined;
function canShareFiles(): boolean {
  if (filesShareable === undefined) {
    try {
      const probe = new File([new Uint8Array(1)], "probe.png", { type: "image/png" });
      filesShareable = !!navigator.canShare?.({ files: [probe] });
    } catch {
      filesShareable = false;
    }
  }
  return filesShareable;
}
const noSubscribe = () => () => {};

/** `url`'s path and query: fetched or downloaded from wherever the reader is, not the canonical origin. */
function sameOrigin(url: string): string {
  try {
    const u = new URL(url, "http://localhost");
    return `${u.pathname}${u.search}`;
  } catch {
    return url;
  }
}

const q = (params: Record<string, string>) => new URLSearchParams(params).toString();

const shape =
  "inline-flex items-center rounded-full px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const pill = `${shape} bg-white/10 hover:bg-white/20`;

export function ShareButtons({ url, headline, dek, storyImage, postImage, fileName, qr }: Props) {
  const sharesFiles = useSyncExternalStore(noSubscribe, canShareFiles, () => false);
  const [status, setStatus] = useState("");
  const file = useRef<Promise<File> | null>(null);

  // Fetched from this page's own origin: `storyImage` is absolute (for the platforms that need a
  // full URL), but the site's configured origin can differ from the one the reader is on (www, a
  // preview host, a dev port), and a cross-origin fetch of it fails before the share sheet opens.
  const fetchClipping = () =>
    (file.current ??= fetch(sameOrigin(storyImage))
      .then((r) => {
        if (!r.ok) throw new Error(`clipping ${r.status}`);
        return r.blob();
      })
      .then((b) => new File([b], `${fileName}.png`, { type: "image/png" }))
      .catch((error: unknown) => {
        file.current = null;
        throw error;
      }));

  // Fetch the clipping ahead, so the share sheet opens straight from the tap (Safari refuses a
  // share that waits too long after it).
  useEffect(() => {
    if (sharesFiles) fetchClipping().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharesFiles, storyImage]);

  async function shareClipping() {
    try {
      const f = await fetchClipping();
      await navigator.share({ files: [f], title: headline });
      setStatus("");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("Couldn't open the share sheet. Try again, or download the image instead.");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied.");
    } catch {
      setStatus("Couldn't copy. The link is: " + url);
    }
  }

  const composers = [
    { name: "X", href: `https://x.com/intent/post?${q({ text: headline, url })}` },
    {
      name: "Threads",
      href: `https://www.threads.net/intent/post?${q({ text: `${headline} ${url}` })}`,
    },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?${q({ u: url })}` },
    { name: "WhatsApp", href: `https://wa.me/?${q({ text: `${headline} ${url}` })}` },
    { name: "Reddit", href: `https://www.reddit.com/submit?${q({ url, title: headline })}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?${q({ url })}` },
    { name: "Telegram", href: `https://t.me/share/url?${q({ url, text: headline })}` },
    {
      name: "Pinterest",
      href: `https://www.pinterest.com/pin/create/button/?${q({ url, media: postImage, description: headline })}`,
    },
  ];
  const mail = `mailto:?${q({ subject: headline, body: `${dek}\n\n${url}` }).replace(/\+/g, "%20")}`;

  return (
    <div className="bg-[#e4ded3] py-10 print:hidden">
      <aside
        aria-labelledby="share-heading"
        className="mx-auto w-[calc(100%-1.5rem)] max-w-3xl rounded-3xl bg-black/85 p-4 font-sans text-sm text-white shadow-lg sm:p-5 print:hidden"
      >
        <h2
          id="share-heading"
          className="text-xs font-semibold tracking-widest uppercase opacity-80"
        >
          Share this story
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Share on">
          {composers.map((c) => (
            <li key={c.name}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={pill}
                aria-label={`Share on ${c.name} (opens in a new tab)`}
              >
                {c.name}
              </a>
            </li>
          ))}
          <li>
            <button type="button" onClick={copyLink} className={pill}>
              Copy link
            </button>
          </li>
          <li>
            <a href={mail} className={pill} aria-label="Share by email">
              Email
            </a>
          </li>
        </ul>

        <div className="mt-4 border-t border-white/20 pt-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase opacity-80">Instagram</h3>
          {sharesFiles ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={shareClipping}
                className={`${shape} bg-white font-semibold text-black hover:bg-white/85`}
              >
                Share to Instagram / Stories
              </button>
              <span className="text-xs opacity-70">
                Pick Instagram in the share sheet; the clipping opens in its editor.
              </span>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap items-start gap-4">
              <div className="flex min-w-0 flex-1 basis-60 flex-col gap-2">
                <p className="text-xs opacity-70">
                  Instagram can&rsquo;t be posted to from a computer. Download the clipping, or scan
                  the code to open this story on your phone and share it from there.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={sameOrigin(storyImage)}
                    download={`${fileName}-story.png`}
                    className={pill}
                  >
                    Download image (Stories, 1080×1920)
                  </a>
                  <a
                    href={sameOrigin(postImage)}
                    download={`${fileName}-post.png`}
                    className={pill}
                  >
                    Feed post (1080×1350)
                  </a>
                </div>
              </div>
              <svg
                viewBox={`0 0 ${qr.size} ${qr.size}`}
                className="size-32 shrink-0 rounded-lg bg-white"
                role="img"
                aria-label={`QR code for ${url}`}
                shapeRendering="crispEdges"
              >
                <path d={qr.d} fill="#000" />
              </svg>
            </div>
          )}
        </div>
        <p role="status" aria-live="polite" className="mt-3 text-xs empty:mt-0">
          {status}
        </p>
      </aside>
    </div>
  );
}
