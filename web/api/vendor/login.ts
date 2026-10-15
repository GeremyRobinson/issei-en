import { checkAccess, createToken, json, sessionCookie } from "../../server/vendor-session.js";

export async function POST(request: Request): Promise<Response> {
  let body: { email?: unknown; code?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Send an email and an access code." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email : "";
  const code = typeof body.code === "string" ? body.code : "";
  if (!checkAccess(email, code)) return json({ error: "Code not recognized" }, { status: 401 });
  return json(
    { email: email.trim().toLowerCase() },
    { headers: { "set-cookie": sessionCookie(createToken(email), request) } },
  );
}
