import "server-only";
import { deflateSync, inflateSync } from "node:zlib";

// Just enough PDF to print a zine: one or more pages, each a content stream that places images
// (JPEG photos as they are; PNG artwork, from the clipping renderer, with its transparency kept as
// a soft mask) and draws a few guide lines. No fonts: every word is in the artwork.

export type PdfImage = {
  width: number;
  height: number;
  /** "jpeg": `data` is a JPEG file. "raw": `data` is 8-bit RGB, `alpha` optional 8-bit gray. */
  kind: "jpeg" | "raw";
  data: Buffer;
  alpha?: Buffer;
  /** JPEG colour components (1 gray, 3 RGB, 4 CMYK). */
  components?: number;
};

/** A JPEG's size and components, from its start-of-frame marker; null if it isn't a JPEG. */
export function jpegInfo(
  buf: Buffer,
): { width: number; height: number; components: number } | null {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1]!;
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return {
        height: buf.readUInt16BE(i + 5),
        width: buf.readUInt16BE(i + 7),
        components: buf[i + 9]!,
      };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

/** Decodes an 8-bit RGB or RGBA, non-interlaced PNG (what resvg writes) into RGB and alpha. */
export function decodePng(buf: Buffer): PdfImage {
  let i = 8;
  let width = 0;
  let height = 0;
  let type = 0;
  const idat: Buffer[] = [];
  while (i < buf.length) {
    const len = buf.readUInt32BE(i);
    const name = buf.toString("latin1", i + 4, i + 8);
    const body = buf.subarray(i + 8, i + 8 + len);
    if (name === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      if (body[8] !== 8 || body[12] !== 0) throw new Error("PNG: only 8-bit, non-interlaced");
      type = body[9]!;
    } else if (name === "IDAT") idat.push(body);
    else if (name === "IEND") break;
    i += 12 + len;
  }
  const bpp = type === 6 ? 4 : type === 2 ? 3 : 0;
  if (!bpp) throw new Error(`PNG: colour type ${type} not supported`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const out = Buffer.alloc(stride * height);
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)]!;
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = out.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp]! : 0;
      const b = prev[x]!;
      const c = x >= bpp ? prev[x - bpp]! : 0;
      let v = line[x]!;
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[x] = v & 0xff;
    }
    prev = cur;
  }
  if (bpp === 3) return { width, height, kind: "raw", data: out };
  const rgb = Buffer.alloc(width * height * 3);
  const alpha = Buffer.alloc(width * height);
  for (let p = 0, q = 0; p < out.length; p += 4, q++) {
    rgb[q * 3] = out[p]!;
    rgb[q * 3 + 1] = out[p + 1]!;
    rgb[q * 3 + 2] = out[p + 2]!;
    alpha[q] = out[p + 3]!;
  }
  return { width, height, kind: "raw", data: rgb, alpha };
}

export type PdfPage = {
  width: number;
  height: number;
  /** The page's drawing operators; images are named /Im0, /Im1… in the order of `images`. */
  content: string;
  images: PdfImage[];
};

/** Writes a PDF. Images are numbered across the whole file, so each page names its own. */
export function writePdf(pages: PdfPage[], info: { title: string }): Buffer {
  const chunks: Buffer[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (b: Buffer | string) => {
    const buf = typeof b === "string" ? Buffer.from(b, "latin1") : b;
    chunks.push(buf);
    length += buf.length;
  };
  const objects: (() => void)[] = [];
  let next = 1;
  const reserve = () => next++;
  const define = (n: number, body: () => void) => {
    objects[n] = () => {
      offsets[n] = length;
      push(`${n} 0 obj\n`);
      body();
      push("\nendobj\n");
    };
  };
  const stream = (n: number, dict: string, data: Buffer) =>
    define(n, () => {
      push(`<< ${dict} /Length ${data.length} >>\nstream\n`);
      push(data);
      push("\nendstream");
    });

  const catalog = reserve();
  const pagesObj = reserve();
  const infoObj = reserve();
  const kids: number[] = [];
  for (const page of pages) {
    const pageObj = reserve();
    const contentObj = reserve();
    kids.push(pageObj);
    const names: string[] = [];
    page.images.forEach((img, i) => {
      const id = reserve();
      names.push(`/Im${i} ${id} 0 R`);
      if (img.kind === "jpeg") {
        const cs =
          img.components === 1
            ? "/DeviceGray"
            : img.components === 4
              ? "/DeviceCMYK"
              : "/DeviceRGB";
        const decode = img.components === 4 ? " /Decode [1 0 1 0 1 0 1 0]" : "";
        stream(
          id,
          `/Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace ${cs} /BitsPerComponent 8 /Filter /DCTDecode${decode}`,
          img.data,
        );
      } else {
        let smask = "";
        if (img.alpha) {
          const m = reserve();
          stream(
            m,
            `/Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode`,
            deflateSync(img.alpha, { level: 9 }),
          );
          smask = ` /SMask ${m} 0 R`;
        }
        stream(
          id,
          `/Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode${smask}`,
          deflateSync(img.data, { level: 9 }),
        );
      }
    });
    stream(contentObj, "/Filter /FlateDecode", deflateSync(Buffer.from(page.content, "latin1")));
    define(pageObj, () =>
      push(
        `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${page.width.toFixed(2)} ${page.height.toFixed(2)}] /Resources << /XObject << ${names.join(" ")} >> >> /Contents ${contentObj} 0 R >>`,
      ),
    );
  }
  define(catalog, () => push(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`));
  define(pagesObj, () =>
    push(
      `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`,
    ),
  );
  const title = info.title.replace(/[\\()]/g, (c) => `\\${c}`).replace(/[^\x20-\x7e]/g, "");
  define(infoObj, () => push(`<< /Title (${title}) /Producer (The Yay News) >>`));

  push("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n");
  for (let n = 1; n < next; n++) objects[n]?.();
  const xref = length;
  push(`xref\n0 ${next}\n0000000000 65535 f \n`);
  for (let n = 1; n < next; n++) push(`${String(offsets[n] ?? 0).padStart(10, "0")} 00000 n \n`);
  push(
    `trailer\n<< /Size ${next} /Root ${catalog} 0 R /Info ${infoObj} 0 R >>\nstartxref\n${xref}\n%%EOF\n`,
  );
  return Buffer.concat(chunks);
}
