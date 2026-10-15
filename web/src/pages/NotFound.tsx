import { useEffect } from "react";
import { Link } from "react-router";
import { TEAS } from "../data/teas";
import "./NotFound.css";

const name = (title: string) => (title === "KYO" ? "Kyō" : title[0] + title.slice(1).toLowerCase());

/** As on the current site: 404, then a way back to every tea. */
export default function NotFound() {
  useEffect(() => {
    document.title = "404 — ISSEI—EN";
  }, []);
  return (
    <section className="grid">
      <p>404</p>
      <div>
        <Link to="/index">/Index</Link>
        <div className="nf-list">
          <span>↳</span>
          <div>
            {TEAS.map((t) => (
              <Link key={t.slug} to={`/index/${t.slug}`} className="nf-row">
                <span>{t.code}</span>
                <span>{name(t.title)}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="blank" style={{ height: 10 }} />
        <Link to="/terms">/Privacy Policy</Link>
      </div>
    </section>
  );
}
