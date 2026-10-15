import prices from "../../server/trade-prices.json";
import { json, sessionEmail } from "../../server/vendor-session.js";

// Trade prices are only ever sent to a signed-in vendor.
export async function GET(request: Request): Promise<Response> {
  const email = sessionEmail(request);
  // Not signed in is a normal answer here, not an error: the page shows the sign-in form.
  if (!email) return json({ email: null });
  return json({ email, prices });
}
