// A small QR code encoder (ISO/IEC 18004): byte mode, error correction level M, versions 1–40,
// with the usual mask selection. Enough to put a story's URL on screen for a phone to scan; kept
// here rather than adding a dependency for one square. Follows the structure of Project Nayuki's
// reference implementation (MIT).

const ECC_PER_BLOCK_M = [
  -1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28,
  28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
];
const BLOCKS_M = [
  -1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25,
  26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49,
];

const bit = (x: number, i: number) => ((x >>> i) & 1) !== 0;

function rawModules(ver: number): number {
  let n = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const align = Math.floor(ver / 7) + 2;
    n -= (25 * align - 10) * align - 55;
    if (ver >= 7) n -= 36;
  }
  return n;
}

const dataCodewords = (ver: number) =>
  Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK_M[ver]! * BLOCKS_M[ver]!;

// ——— Reed–Solomon over GF(2^8), polynomial 0x11D ———

function gfMul(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMul(result[j]!, root);
      if (j + 1 < result.length) result[j]! ^= result[j + 1]!;
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

function rsRemainder(data: number[], divisor: number[]): number[] {
  const result = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ result.shift()!;
    result.push(0);
    divisor.forEach((d, i) => (result[i]! ^= gfMul(d, factor)));
  }
  return result;
}

// ——— Encoding ———

function codewords(bytes: Uint8Array): { ver: number; words: number[] } {
  let ver = 1;
  for (; ver <= 40; ver++) {
    const countBits = ver < 10 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= dataCodewords(ver) * 8) break;
  }
  if (ver > 40) throw new Error("Too much data for a QR code");

  const bits: number[] = [];
  const push = (value: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, ver < 10 ? 8 : 16);
  bytes.forEach((b) => push(b, 8));
  const capacity = dataCodewords(ver) * 8;
  push(0, Math.min(4, capacity - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) push(pad, 8);

  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    data.push(bits.slice(i, i + 8).reduce((acc, b) => (acc << 1) | b, 0));
  }

  // Split into blocks, add each block's error correction, then interleave.
  const numBlocks = BLOCKS_M[ver]!;
  const eccLen = ECC_PER_BLOCK_M[ver]!;
  const raw = Math.floor(rawModules(ver) / 8);
  const numShort = numBlocks - (raw % numBlocks);
  const shortLen = Math.floor(raw / numBlocks);
  const divisor = rsDivisor(eccLen);
  const blocks: number[][] = [];
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const dat = data.slice(k, k + shortLen - eccLen + (i < numShort ? 0 : 1));
    k += dat.length;
    const ecc = rsRemainder(dat, divisor);
    if (i < numShort) dat.push(0);
    blocks.push([...dat, ...ecc]);
  }
  const words: number[] = [];
  for (let i = 0; i < blocks[0]!.length; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortLen - eccLen || j >= numShort) words.push(block[i]!);
    });
  }
  return { ver, words };
}

type Grid = { size: number; dark: boolean[][]; fixed: boolean[][] };

function alignmentPositions(ver: number, size: number): number[] {
  if (ver === 1) return [];
  const n = Math.floor(ver / 7) + 2;
  const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
  const result = [6];
  for (let pos = size - 7; result.length < n; pos -= step) result.splice(1, 0, pos);
  return result;
}

function drawFormat(g: Grid, mask: number) {
  const data = (0 << 3) | mask; // level M's format bits are 00
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const bits = ((data << 10) | rem) ^ 0x5412;
  const set = (x: number, y: number, v: boolean) => {
    g.dark[y]![x] = v;
    g.fixed[y]![x] = true;
  };
  for (let i = 0; i <= 5; i++) set(8, i, bit(bits, i));
  set(8, 7, bit(bits, 6));
  set(8, 8, bit(bits, 7));
  set(7, 8, bit(bits, 8));
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(bits, i));
  for (let i = 0; i < 8; i++) set(g.size - 1 - i, 8, bit(bits, i));
  for (let i = 8; i < 15; i++) set(8, g.size - 15 + i, bit(bits, i));
  set(8, g.size - 8, true);
}

function baseGrid(ver: number): Grid {
  const size = ver * 4 + 17;
  const g: Grid = {
    size,
    dark: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
    fixed: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
  };
  const set = (x: number, y: number, v: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    g.dark[y]![x] = v;
    g.fixed[y]![x] = true;
  };
  for (let i = 0; i < size; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [
    [3, 3],
    [size - 4, 3],
    [3, size - 4],
  ] as const) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        set(cx + dx, cy + dy, d !== 2 && d !== 4);
      }
    }
  }
  const align = alignmentPositions(ver, size);
  const last = align.length - 1;
  align.forEach((ax, i) =>
    align.forEach((ay, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }),
  );
  drawFormat(g, 0); // reserve the format areas; redrawn with the chosen mask
  if (ver >= 7) {
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      set(a, b, bit(bits, i));
      set(b, a, bit(bits, i));
    }
  }
  return g;
}

function drawData(g: Grid, words: number[]) {
  let i = 0;
  for (let right = g.size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < g.size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? g.size - 1 - vert : vert;
        if (!g.fixed[y]![x] && i < words.length * 8) {
          g.dark[y]![x] = bit(words[i >>> 3]!, 7 - (i & 7));
          i++;
        }
      }
    }
  }
}

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

function applyMask(g: Grid, mask: number): boolean[][] {
  const fn = MASKS[mask]!;
  return g.dark.map((row, y) => row.map((d, x) => (g.fixed[y]![x] ? d : d !== fn(x, y))));
}

/** The standard's penalty score: long runs, 2×2 blocks, finder look-alikes, dark balance. */
function penalty(m: boolean[][]): number {
  const size = m.length;
  let score = 0;
  const lines: string[] = [];
  for (let i = 0; i < size; i++) {
    lines.push(m[i]!.map((d) => (d ? "1" : "0")).join(""));
    lines.push(m.map((row) => (row[i] ? "1" : "0")).join(""));
  }
  for (const line of lines) {
    for (const run of line.match(/0{5,}|1{5,}/g) ?? []) score += run.length - 2;
    for (const re of [/(?=10111010000)/g, /(?=00001011101)/g])
      score += 40 * (line.match(re)?.length ?? 0);
  }
  let dark = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const c = m[y]![x]!;
      if (c) dark++;
      if (
        x < size - 1 &&
        y < size - 1 &&
        c === m[y]![x + 1] &&
        c === m[y + 1]![x] &&
        c === m[y + 1]![x + 1]
      ) {
        score += 3;
      }
    }
  }
  const total = size * size;
  score += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
  return score;
}

/** The QR code for `text` as a grid of dark modules (true), without the quiet zone. */
export function qrModules(text: string): boolean[][] {
  const { ver, words } = codewords(new TextEncoder().encode(text));
  const g = baseGrid(ver);
  drawData(g, words);
  let best: boolean[][] = [];
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const trial: Grid = { ...g, dark: applyMask(g, mask), fixed: g.fixed.map((r) => [...r]) };
    drawFormat(trial, mask);
    const score = penalty(trial.dark);
    if (score < bestScore) [best, bestScore] = [trial.dark, score];
  }
  return best;
}

/** The QR code as an SVG path (one unit per module) and its size including a 4-module margin. */
export function qrPath(text: string): { size: number; d: string } {
  const m = qrModules(text);
  const q = 4;
  let d = "";
  m.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) d += `M${x + q} ${y + q}h1v1h-1z`;
    }),
  );
  return { size: m.length + q * 2, d };
}
