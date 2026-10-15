import { useEffect, useState } from "react";
import { RollingText } from "./RollingText";
import { cart, count, total, unitPrice, useCart } from "../lib/cart";
import { teaBySlug, label } from "../data/teas";
import { money } from "../lib/format";
import { startCheckout } from "../lib/checkout";
import "./Cart.css";

const OPEN = "issei:cart-open";
export const openCart = () => window.dispatchEvent(new Event(OPEN));

/** Hidden until something is added. Then a single line at the bottom that opens into the cart. */
export function Cart() {
  const lines = useCart();
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState("Checkout");

  useEffect(() => {
    const show = () => setOpen(true);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener(OPEN, show);
    window.addEventListener("keydown", esc);
    return () => (window.removeEventListener(OPEN, show), window.removeEventListener("keydown", esc));
  }, []);
  useEffect(() => {
    if (!lines.length) setOpen(false);
  }, [lines.length]);

  if (!lines.length) return null;

  async function onCheckout() {
    setCheckout("One moment");
    const result = await startCheckout(lines);
    setCheckout(result);
    setTimeout(() => setCheckout("Checkout"), 1600);
  }

  return (
    <aside className={`cart${open ? " is-open" : ""}`} aria-label="Cart">
      <div className="grid cart-head">
        <button onClick={() => setOpen(!open)} aria-expanded={open}>
          Cart (<RollingText text={String(count(lines))} />)
        </button>
        <span className="desktop" />
        <p className="cart-r">
          Total <RollingText text={money(total(lines))} stagger={10} />
        </p>
      </div>
      <div className="cart-rows">
        <div>
          {lines.map((l) => {
            const t = teaBySlug(l.slug)!;
            return (
              <div className="grid cart-row" key={l.slug}>
                <div className="lv">
                  <span>{label(t)}</span>
                  <span>{t.retail?.size}</span>
                </div>
                <div className="cart-qty">
                  <button onClick={() => cart.setQty(l.slug, l.qty - 1)} aria-label={`One less ${t.title}`}>
                    —
                  </button>
                  <RollingText text={String(l.qty)} />
                  <button onClick={() => cart.setQty(l.slug, l.qty + 1)} aria-label={`One more ${t.title}`}>
                    +
                  </button>
                  <button className="u" onClick={() => cart.remove(l.slug)}>
                    Remove
                  </button>
                </div>
                <p className="cart-r">
                  <RollingText text={money(unitPrice(l.slug) * l.qty)} stagger={10} />
                </p>
              </div>
            );
          })}
          <div className="grid cart-row">
            <span />
            <span className="desktop" />
            <p className="cart-r">
              <button className="u" onClick={onCheckout}>
                <RollingText text={checkout} stagger={8} />
              </button>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
