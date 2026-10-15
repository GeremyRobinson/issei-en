// Vendor access for Pricing: who may sign in, and the signed cookie that
// remembers them. Runs only on the server (the /api routes).

import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "issei_vendor";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const isProduction = () => process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

function secret(): string {
  const s = process.env.VENDOR_SESSION_SECRET;
  if (s) return s;
  if (isProduction()) throw new Error("VENDOR_SESSION_SECRET is not set");
  return "local-development-only";
}

const digits = (code: string) => code.replace(/\D/g, "");
const normalEmail = (email: string) => email.trim().toLowerCase();

/** VENDOR_ACCESS="a@x.com:1234-5678,b@y.com:8765-4321" */
export function vendorList(env = process.env.VENDOR_ACCESS): Map<string, string> {
  const list = new Map<string, string>();
  for (const pair of (env ?? "").split(",")) {
    const i = pair.lastIndexOf(":");
    if (i < 1) continue;
    list.set(normalEmail(pair.slice(0, i)), digits(pair.slice(i + 1)));
  }
  return list;
}

function sameText(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkAccess(email: string, code: string, list = vendorList()): boolean {
  const e = normalEmail(email), c = digits(code);
  if (!e || c.length < 4) return false;
  // Local development without a vendor list: any email with 0000-0000.
  if (list.size === 0 && !isProduction()) return sameText(c, "00000000");
  const expected = list.get(e);
  return expected !== undefined && sameText(c, expected);
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (payload: string, key = secret()) => createHmac("sha256", key).update(payload).digest("base64url");

export function createToken(email: string, now = Date.now(), key = secret()): string {
  const payload = b64(JSON.stringify({ e: normalEmail(email), x: Math.floor(now / 1000) + MAX_AGE }));
  return `${payload}.${sign(payload, key)}`;
}

export function readToken(token: string | undefined, now = Date.now(), key = secret()): string | null {
  if (!token) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac || !sameText(mac, sign(payload, key))) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof e === "string" && typeof x === "number" && x > now / 1000 ? e : null;
  } catch {
    return null;
  }
}

export function sessionEmail(request: Request): string | null {
  const cookies = request.headers.get("cookie") ?? "";
  const match = cookies.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  const email = readToken(match?.slice(COOKIE.length + 1));
  // A vendor removed from the list loses access at once, even with a valid cookie.
  const list = vendorList();
  if (email && list.size > 0 && !list.has(email)) return null;
  return email;
}

export function sessionCookie(token: string | null, request: Request): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return token
    ? `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`
    : `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...init.headers },
  });
