"use client";

import { useState } from "react";
import { useStamps } from "@/features/habits/api";
import { Scrap } from "@/features/riot";
import { GoAction } from "./go-action";
import { takeInstallPrompt } from "./offline";

// The one ask on the closed shutter, once a reader has finished three papers: put the paper on
// your home screen. Uses the browser's own install prompt where there is one; on iPhone and iPad,
// where there isn't, it says how. Never shown again once dismissed or installed.

const DISMISSED = "yn-install-asked";
export const INSTALL_AFTER = 3;

function asked(): boolean {
  try {
    return localStorage.getItem(DISMISSED) === "1";
  } catch {
    return true;
  }
}

function standalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallAsk() {
  const stamps = useStamps();
  // Only rendered after hydration (inside the closed shutter), so the browser can be asked here.
  const [hidden, setHidden] = useState(() => asked() || standalone());
  const [howTo, setHowTo] = useState(false);
  if (hidden || stamps.length < INSTALL_AFTER) return null;

  const done = () => {
    try {
      localStorage.setItem(DISMISSED, "1");
    } catch {
      /* fine: it may ask again */
    }
    setHidden(true);
  };

  const install = async () => {
    const prompt = takeInstallPrompt();
    if (prompt) {
      await prompt.prompt();
      done();
    } else setHowTo(true);
  };

  return (
    <Scrap seed="install" ground="white" tape="top-left" as="aside" className="ys-install">
      <p className="ys-install__line">
        That&rsquo;s {stamps.length} papers finished. Put the paper on your home screen?
      </p>
      {howTo ? (
        <p className="ys-install__how">
          Tap <b>Share</b> in your browser, then <b>Add to Home Screen</b>. It opens straight to
          today&rsquo;s paper.
        </p>
      ) : null}
      <p className="ys-install__row">
        <GoAction onClick={install}>Add to home screen</GoAction>
        <GoAction tone="quiet" onClick={done}>
          No thanks
        </GoAction>
      </p>
    </Scrap>
  );
}
