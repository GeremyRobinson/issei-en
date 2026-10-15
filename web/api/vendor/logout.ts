import { json, sessionCookie } from "../../server/vendor-session.js";

export async function POST(request: Request): Promise<Response> {
  return json({ ok: true }, { headers: { "set-cookie": sessionCookie(null, request) } });
}
