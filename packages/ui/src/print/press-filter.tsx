/**
 * The printing press, as an SVG filter applied to every sheet (see print.css).
 *
 * Screen type has perfect vector edges and perfectly even density, which is what makes it read as
 * a computer. Ink on newsprint does three things this reproduces:
 *  - edges go ragged where ink wicks into the fibres (fine noise displaces the artwork a fraction
 *    of a pixel),
 *  - strokes thicken slightly (dot gain: a hair of blur, then contrast pulled back up),
 *  - coverage is uneven across the sheet (low-frequency noise lifts the ink in soft patches).
 * Each is kept light enough that body text stays crisp at reading size (eased 2026-09-30 after
 * the owner found the text a little soft). Seeds are fixed so the page prints identically every time.
 */
export function PressFilter() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="press" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          {/* Ragged edges */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.1"
            numOctaves="2"
            seed="4"
            result="fibre"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="fibre"
            scale="0.9"
            xChannelSelector="R"
            yChannelSelector="G"
            result="wicked"
          />
          {/* Dot gain: soften, then sharpen the edge back so strokes end up a touch heavier */}
          <feGaussianBlur in="wicked" stdDeviation="0.22" result="spread" />
          <feComponentTransfer in="spread" result="gained">
            <feFuncR type="linear" slope="1.12" intercept="-0.06" />
            <feFuncG type="linear" slope="1.12" intercept="-0.06" />
            <feFuncB type="linear" slope="1.12" intercept="-0.06" />
          </feComponentTransfer>
          {/* Uneven inking: soft patches where the press laid down a little less ink (the brightest
              parts of a slow noise become a faint white wash) */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.03"
            numOctaves="3"
            seed="11"
            result="blotch"
          />
          <feColorMatrix
            in="blotch"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.45 0 0 0 -0.27"
            result="lift"
          />
          <feBlend in="gained" in2="lift" mode="screen" result="inked" />
          {/* Speckle: tiny dropouts where fibres didn't take ink (only the top of fine noise) */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2.2"
            numOctaves="1"
            seed="23"
            result="dust"
          />
          <feColorMatrix
            in="dust"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  7 0 0 0 -5.5"
            result="specks"
          />
          <feBlend in="inked" in2="specks" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}
