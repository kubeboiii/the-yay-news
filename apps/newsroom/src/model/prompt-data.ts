// Every batched prompt carries its items as one JSON block between markers, so the instructions stay
// readable and the fake model can answer from the same data a real one sees.

const OPEN = "<<<DATA";
const CLOSE = "DATA>>>";

export function withData(instructions: string, data: unknown): string {
  return `${instructions.trim()}\n\n${OPEN}\n${JSON.stringify(data, null, 1)}\n${CLOSE}\n`;
}

export function readData<T>(prompt: string): T {
  const start = prompt.indexOf(OPEN);
  const end = prompt.lastIndexOf(CLOSE);
  if (start < 0 || end < start) throw new Error("prompt has no data block");
  return JSON.parse(prompt.slice(start + OPEN.length, end)) as T;
}
