import { useEffect, useState } from "react";
import { Link } from "react-router";
import { TEAS, image, label } from "../data/teas";
import { loadSession, signOut, type VendorSession } from "../lib/vendor";
import { money } from "../lib/format";
import { VendorLogin } from "../components/VendorLogin";
import { RollingText } from "../components/RollingText";
import "./Pricing.css";

const TIERS = [
  ["Tins", "40g"],
  ["Retail", "1kg"],
  ["Wholesale", "10kg"],
  ["Bulk", "50kg"],
] as const;

/** Pricing, as on the current site, for signed-in vendors only. */
export default function Pricing() {
  const [session, setSession] = useState<VendorSession | null | undefined>(undefined);
  const refresh = () => loadSession().then(setSession);
  useEffect(() => {
    document.title = "Pricing — ISSEI—EN";
    refresh();
  }, []);

  // checking for a session: show nothing rather than flash the sign-in block
  if (session === undefined) return null;
  // signed out: only the sign-in block; nothing of Pricing is shown
  if (session === null)
    return (
      <section className="grid">
        <VendorLogin onSignedIn={refresh} />
      </section>
    );

  return (
    <section className="pricing grid">
      <div className="pricing-info">
        <div className="half">
          <span>General</span>
          <span>
            To place an order, inquire about white labeling, custom volume, or general info, please email us at{" "}
            <a className="u" href="mailto:info@issei-en.com">
              info@issei-en.com
            </a>
            . All orders require 3 weeks from confirmed order to ship.
          </span>
        </div>
        <div className="blank" />
        <div className="half">
          <span>Support</span>
          <span>
            For status updates, changes, or issues on an existing order, contact{" "}
            <a className="u" href="mailto:sales@issei-en.com">
              sales@issei-en.com
            </a>{" "}
            with your order or item code.
          </span>
        </div>
        <div className="blank" />
        <div className="blank" />
        <div className="half">
          <span>Vendor</span>
          <span>
            {session.email}
            <br />
            <button className="u" onClick={() => signOut().then(() => setSession(null))}>
              Sign out
            </button>
          </span>
        </div>
        <div className="blank" />
        <div className="blank" />
        <p>* Price per 1kg</p>
      </div>

      {TEAS.map((t) => {
        const prices = session.prices[t.slug];
        return (
          <div className="pricing-item" key={t.slug}>
            <figure className="sq">
              <img src={image(t, 1)} alt={`${t.title} powder`} loading="lazy" />
            </figure>
            <div className="tiers pricing-head">
              <span>{label(t)}</span>
              <span className="available">{t.available ? "Available" : "Unavailable"}</span>
            </div>
            <p className="pricing-more">
              <Link className="u" to={`/index/${t.slug}`}>
                More Info
              </Link>
            </p>
            {TIERS.map(([name, size]) => {
              const p = prices?.[size];
              const shown = !prices ? "—" : p ? `${money(p, 0)}${size === "40g" ? "" : "*"}` : "Inquire";
              return (
                <div className="tiers" key={size}>
                  <span>{name}</span>
                  <span>{size}</span>
                  <span>
                    <RollingText text={shown} stagger={18} />
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
