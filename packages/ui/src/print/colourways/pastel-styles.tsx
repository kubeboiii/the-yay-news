import { pastels, pastelVars } from "./pastels.ts";

/**
 * Every pastel colourway as [data-pastel="slug"] { --pz-*: … }. Each pastel design maps the --pz-*
 * vocabulary onto its own tokens in its stylesheet, so an element (or <html>) only needs the
 * attribute to print in that colourway.
 */
export function PastelStyles() {
  const css = pastels
    .map(
      (p) =>
        `[data-pastel="${p.slug}"]{${Object.entries(pastelVars(p))
          .map(([k, v]) => `${k}:${v}`)
          .join(";")}}`,
    )
    .join("\n");
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
