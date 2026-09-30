import { createHash, timingSafeEqual } from "node:crypto";
import type { Context, MiddlewareHandler } from "hono";
import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { env } from "../../config/env.js";
import { AppError } from "../../lib/errors.js";

// Password login for the emergency admin: one shared password from ADMIN_PASSWORD, compared in
// constant time, then an HTTP-only signed session cookie. Failed logins are rate limited.

export const SESSION_COOKIE = "yay_admin";
export const COOKIE_PATH = "/api/v1/admin";
const SESSION_SECONDS = 8 * 60 * 60;

const sha256 = (s: string) => createHash("sha256").update(s).digest();

/** Hashing both sides first makes the lengths equal, so the comparison leaks nothing. */
export function passwordMatches(given: string, expected: string) {
  return timingSafeEqual(sha256(given), sha256(expected));
}

export function adminPassword() {
  if (!env.ADMIN_PASSWORD) {
    throw new AppError(503, "ADMIN_DISABLED", "The admin is switched off (no ADMIN_PASSWORD)");
  }
  return env.ADMIN_PASSWORD;
}

/** Derived from the password, so changing the password ends every session. */
const sessionSecret = () => sha256(`yay-admin-session:${adminPassword()}`).toString("hex");

export async function startSession(c: Context) {
  const expires = Date.now() + SESSION_SECONDS * 1000;
  await setSignedCookie(c, SESSION_COOKIE, `admin.${expires}`, sessionSecret(), {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "Strict",
    path: COOKIE_PATH,
    maxAge: SESSION_SECONDS,
  });
}

export const endSession = (c: Context) => deleteCookie(c, SESSION_COOKIE, { path: COOKIE_PATH });

export const requireSession: MiddlewareHandler = async (c, next) => {
  const value = await getSignedCookie(c, sessionSecret(), SESSION_COOKIE);
  const expires = typeof value === "string" ? Number(value.replace(/^admin\./, "")) : NaN;
  if (!(expires > Date.now())) {
    throw new AppError(401, "UNAUTHORISED", "Log in to use the admin");
  }
  await next();
};

// --- Rate limiting -------------------------------------------------------------------------------

const WINDOW_MS = 15 * 60 * 1000;
/** Failed attempts allowed per client, and in total, per window. */
const PER_CLIENT = 5;
const OVERALL = 30;

type Bucket = { failures: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const ALL = "*";

function bucket(key: string, now: number) {
  let b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    b = { failures: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, b);
  }
  return b;
}

/** The client, as told by the proxy in front of us (the frontend's rewrite), else one shared key. */
export const clientKey = (c: Context) =>
  c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || "local";

/** Throws 429 with Retry-After when the client (or everyone together) has failed too often. */
export function checkLoginAllowed(c: Context, now = Date.now()) {
  for (const [key, limit] of [
    [clientKey(c), PER_CLIENT],
    [ALL, OVERALL],
  ] as const) {
    const b = bucket(key, now);
    if (b.failures >= limit) {
      c.header("Retry-After", String(Math.ceil((b.resetAt - now) / 1000)));
      throw new AppError(429, "TOO_MANY_ATTEMPTS", "Too many failed logins; try again later");
    }
  }
}

export function recordLoginFailure(c: Context, now = Date.now()) {
  bucket(clientKey(c), now).failures += 1;
  bucket(ALL, now).failures += 1;
}

export const recordLoginSuccess = (c: Context) => buckets.delete(clientKey(c));

/** For tests. */
export const resetLoginLimits = () => buckets.clear();
