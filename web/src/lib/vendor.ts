/** The browser side of vendor access. Prices only come from the server once signed in. */

export type TradePrices = Record<string, { "40g": number | null; "1kg": number | null; "10kg": number | null; "50kg": number | null }>;
export type VendorSession = { email: string; prices: TradePrices };

export async function loadSession(): Promise<VendorSession | null> {
  const res = await fetch("/api/vendor/prices", { credentials: "same-origin" }).catch(() => null);
  if (!res) return null;
  const body = await res.json().catch(() => null);
  return res.ok && body?.email ? body : null;
}

export async function signIn(email: string, code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/vendor/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ email, code }),
  }).catch(() => null);
  if (!res) return { ok: false, error: "Try again in a moment" };
  if (res.ok) return { ok: true };
  const body = await res.json().catch(() => ({}));
  return { ok: false, error: body.error ?? "Code not recognized" };
}

export async function signOut(): Promise<void> {
  await fetch("/api/vendor/logout", { method: "POST", credentials: "same-origin" }).catch(() => null);
}
