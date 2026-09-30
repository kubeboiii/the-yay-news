"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

// The emergency admin's one screen. It talks to /api/v1/admin (proxied to the backend), which
// holds the session in an HTTP-only cookie; this component never sees a token.

type AdminStory = {
  id: string;
  slug: string;
  headline: string;
  section: string;
  slot: "lead" | "feature" | "brief";
  page: number;
};

type AdminEdition = {
  issueNumber: number;
  date: string;
  status: "draft" | "scheduled" | "published" | "pulled";
  kind: "regular" | "slow_news_day";
  design: string;
  stories: AdminStory[];
  reserves: AdminStory[];
};

type ApiResult<T> = { data?: T; error?: { code: string; message: string } };

const API = "/api/v1/admin";

async function call<T>(
  path: string,
  init?: RequestInit,
): Promise<{ status: number } & ApiResult<T>> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "content-type": "application/json" },
    credentials: "same-origin",
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as ApiResult<T>;
  return { status: res.status, ...body };
}

export function AdminPanel() {
  const [state, setState] = useState<"checking" | "out" | "in">("checking");
  const [editions, setEditions] = useState<AdminEdition[]>([]);
  const [message, setMessage] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await call<AdminEdition[]>("/editions?limit=14");
    if (res.status === 401) return setState("out");
    if (res.error) return setMessage({ tone: "bad", text: res.error.message });
    setEditions(res.data ?? []);
    setState("in");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- state is set after the fetch resolves
    void load();
  }, [load]);

  async function act(path: string, confirmText: string, done: (data: unknown) => string) {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    const res = await call(path, { method: "POST" });
    setBusy(false);
    if (res.status === 401) return setState("out");
    setMessage(
      res.error ? { tone: "bad", text: res.error.message } : { tone: "ok", text: done(res.data) },
    );
    await load();
  }

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    setBusy(true);
    const res = await call("/login", { method: "POST", body: JSON.stringify({ password }) });
    setBusy(false);
    if (res.error) return setMessage({ tone: "bad", text: res.error.message });
    setMessage(null);
    await load();
  }

  async function logout() {
    await call("/logout", { method: "POST" });
    setEditions([]);
    setState("out");
  }

  const flash = message && (
    <p className={`adm__flash adm__flash--${message.tone}`} role="status">
      {message.text}
    </p>
  );

  if (state === "checking") return <p className="adm__note">Checking…</p>;

  if (state === "out") {
    return (
      <form className="adm__login" onSubmit={login}>
        {flash}
        <label htmlFor="adm-password">Password</label>
        <input
          id="adm-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <button type="submit" disabled={busy}>
          Log in
        </button>
      </form>
    );
  }

  return (
    <div className="adm__desk">
      <div className="adm__bar">
        <button
          type="button"
          className="adm__danger"
          disabled={busy}
          onClick={() =>
            act(
              "/rollback",
              "Roll back? This pulls the edition readers are getting now, so they get the previous one.",
              (d) => {
                const r = d as { pulled: number; nowServing: number | null };
                return `Pulled issue ${r.pulled}. Now serving ${r.nowServing ? `issue ${r.nowServing}` : "nothing"}.`;
              },
            )
          }
        >
          Roll back today&rsquo;s paper
        </button>
        <button type="button" onClick={logout}>
          Log out
        </button>
      </div>
      {flash}
      <ol className="adm__list">
        {editions.map((e) => (
          <li key={e.issueNumber} className="adm__edition">
            <div className="adm__row">
              <button
                type="button"
                className="adm__toggle"
                aria-expanded={open === e.issueNumber}
                onClick={() => setOpen(open === e.issueNumber ? null : e.issueNumber)}
              >
                <span className="adm__issue">No. {e.issueNumber}</span>
                <span>{e.date}</span>
                <span className={`adm__status adm__status--${e.status}`}>{e.status}</span>
                {e.kind === "slow_news_day" ? (
                  <span className="adm__tag">slow news day</span>
                ) : null}
                <span className="adm__meta">
                  {e.stories.length} stories · {e.reserves.length} reserves
                </span>
              </button>
              {e.status === "pulled" || e.status === "draft" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    act(
                      `/editions/${e.issueNumber}/republish`,
                      `Republish issue ${e.issueNumber}?`,
                      () => `Issue ${e.issueNumber} is published.`,
                    )
                  }
                >
                  Republish
                </button>
              ) : (
                <button
                  type="button"
                  className="adm__danger"
                  disabled={busy}
                  onClick={() =>
                    act(
                      `/editions/${e.issueNumber}/pull`,
                      `Pull the whole of issue ${e.issueNumber}?`,
                      () => `Issue ${e.issueNumber} is pulled.`,
                    )
                  }
                >
                  Pull edition
                </button>
              )}
            </div>
            {open === e.issueNumber ? (
              <table className="adm__stories">
                <thead>
                  <tr>
                    <th scope="col">Page</th>
                    <th scope="col">Story</th>
                    <th scope="col">
                      <span className="adm__sr">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {e.stories.map((s) => (
                    <tr key={s.id}>
                      <td>{s.page}</td>
                      <td>
                        <strong>{s.headline}</strong>
                        <span className="adm__meta">
                          {s.section} · {s.slot} · {s.slug}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="adm__danger"
                          disabled={busy}
                          onClick={() =>
                            act(
                              `/editions/${e.issueNumber}/stories/${encodeURIComponent(s.slug)}/pull`,
                              `Pull “${s.headline}”? ${e.reserves.length ? "A reserve takes its place." : "There are no reserves left, so the space stays empty."}`,
                              (d) => {
                                const r = d as { replacement: AdminStory | null };
                                return r.replacement
                                  ? `Pulled. Replaced with “${r.replacement.headline}”.`
                                  : "Pulled. No reserve was left to replace it.";
                              },
                            )
                          }
                        >
                          Pull
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
