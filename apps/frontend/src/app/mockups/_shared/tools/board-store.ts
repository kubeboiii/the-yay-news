// The reader's pinboard, kept in the browser: every clipping they cut out, as the image and where it
// hangs on the board. IndexedDB rather than localStorage because clippings are images.

export type Clipping = {
  id: string;
  version: string;
  /** Path of the page it was cut from, e.g. /mockups/v1/gaming. */
  page: string;
  headline: string;
  createdAt: number;
  /** The rasterised clipping, at twice its on-screen size. */
  image: Blob;
  /** Its size on the page when it was cut, in CSS pixels. */
  w: number;
  h: number;
  /** The colour of the stock it was cut from. */
  paper: string;
  /** Where it hangs: left and top as fractions of the board's width; tilt in degrees; stacking. */
  x?: number;
  y?: number;
  /** The same on a phone's narrow board, which is arranged on its own. */
  nx?: number;
  ny?: number;
  rot?: number;
  z?: number;
};

const DB = "yn-board";
const STORE = "clippings";
export const BOARD_EVENT = "yn-board-change";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => {
      db.close();
      resolve(req.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/** Tells every open page (this tab and others) that the board changed. */
function announce() {
  window.dispatchEvent(new Event(BOARD_EVENT));
  try {
    const ch = new BroadcastChannel(DB);
    ch.postMessage("change");
    ch.close();
  } catch {
    // No BroadcastChannel: other tabs catch up on their next load.
  }
}

/** Calls back whenever the board changes, here or in another tab. Returns the unsubscribe. */
export function onBoardChange(cb: () => void) {
  window.addEventListener(BOARD_EVENT, cb);
  let ch: BroadcastChannel | undefined;
  try {
    ch = new BroadcastChannel(DB);
    ch.onmessage = cb;
  } catch {
    ch = undefined;
  }
  return () => {
    window.removeEventListener(BOARD_EVENT, cb);
    ch?.close();
  };
}

export async function listClippings(): Promise<Clipping[]> {
  const all = await run<Clipping[]>("readonly", (s) => s.getAll() as IDBRequest<Clipping[]>);
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export const countClippings = () => run<number>("readonly", (s) => s.count());

export async function addClipping(c: Clipping) {
  await run("readwrite", (s) => s.put(c));
  announce();
}

export async function updateClipping(id: string, patch: Partial<Clipping>) {
  const db = await open();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const get = store.get(id);
    get.onsuccess = () => {
      if (get.result) store.put({ ...(get.result as Clipping), ...patch });
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function removeClipping(id: string) {
  await run("readwrite", (s) => s.delete(id));
  announce();
}

/** A short stable number from a clipping's id, so its tilt, tape and edge are the same every visit. */
export function seedOf(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}
