import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { RollingText } from "./RollingText";
import { count, useCart } from "../lib/cart";
import { openCart } from "./Cart";
import "./Header.css";

const pad = (n: number) => String(n).padStart(2, "0");

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const offset = -now.getTimezoneOffset() / 60;
  const zone =
    new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(now).find((p) => p.type === "timeZoneName")
      ?.value ?? "";
  return (
    <p aria-label="Local time">
      <RollingText text={`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`} />
      {`  GMT${offset >= 0 ? "+" : ""}${offset} ${zone && !zone.startsWith("GMT") ? zone : "UTC"}`}
    </p>
  );
}

/** The top line: nav, wordmark, clock. Sticky, and inverts what passes under it. */
export function Header() {
  const { pathname } = useLocation();
  const lines = useCart();
  const n = count(lines);
  const at = pathname === "/" ? "info" : pathname.startsWith("/index") && !pathname.startsWith("/index/pricing") ? "index" : null;

  return (
    <header className="header grid">
      <nav aria-label="Main">
        <Link to="/" className={at === "info" ? "u" : undefined} aria-current={at === "info" ? "page" : undefined}>
          <span className="desktop">Information</span>
          <span className="mobile">Info</span>
        </Link>
        {", "}
        <Link to="/index" className={at === "index" ? "u" : undefined} aria-current={at === "index" ? "page" : undefined}>
          Index
        </Link>
        {n > 0 && (
          <>
            {", "}
            <button onClick={openCart}>
              Cart (<RollingText text={String(n)} />)
            </button>
          </>
        )}
      </nav>
      <Link to="/">ISSEI—EN</Link>
      <div className="desktop">
        <Clock />
      </div>
    </header>
  );
}
