/**
 * The chat preview: the same app in one self-contained page. There is no
 * server behind it, so vendor sign-in is simulated here (any email with
 * 0000-0000). This file is never part of the real site.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { Link, MemoryRouter } from "react-router";
import App from "./App";
import prices from "../server/trade-prices.json";

let signedIn: string | null = null;
const reply = (body: unknown) => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
const realFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.endsWith("/api/vendor/prices")) return reply(signedIn ? { email: signedIn, prices } : { email: null });
  if (url.endsWith("/api/vendor/logout")) return (signedIn = null), reply({ ok: true });
  if (url.endsWith("/api/vendor/login")) {
    const { email, code } = JSON.parse(String(init?.body ?? "{}"));
    if (String(code).replace(/\D/g, "") !== "00000000") return new Response(JSON.stringify({ error: "Code not recognized" }), { status: 401 });
    signedIn = String(email).trim().toLowerCase();
    return reply({ email: signedIn });
  }
  if (url.endsWith("/api/checkout")) return new Response("", { status: 404 });
  return realFetch(input, init);
};

/** Preview only: the chat has no address bar, so these reach pages the nav does not link to. */
function PreviewPages() {
  const style = { position: "fixed", bottom: 10, left: 10, zIndex: 20, background: "var(--ground)", padding: "3px 6px" } as const;
  return (
    <p style={style}>
      Preview: <Link className="u" to="/index/pricing">Pricing</Link>, <Link className="u" to="/terms">Terms</Link>,{" "}
      <Link className="u" to="/not-a-page">404</Link>
    </p>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemoryRouter>
      <App />
      <PreviewPages />
    </MemoryRouter>
  </StrictMode>,
);
