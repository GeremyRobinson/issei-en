import type { Line } from "./cart";

/**
 * Hands the cart to Stripe Checkout. Stripe is connected in the next step
 * (an /api/checkout route that creates a Checkout Session); until then this
 * reports that checkout is not available yet.
 */
export async function startCheckout(lines: Line[]): Promise<string> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ lines }),
  }).catch(() => null);
  if (res?.ok) {
    const { url } = await res.json();
    if (url) window.location.href = url;
    return "Checkout";
  }
  return "Checkout opens soon";
}
