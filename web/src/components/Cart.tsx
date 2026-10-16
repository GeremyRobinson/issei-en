import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { RollingText } from "./RollingText";
import { cart, setCartOpen, total, unitPrice, useCart, useCartOpen } from "../lib/cart";
import { teaBySlug, label } from "../data/teas";
import { money } from "../lib/format";
import { startCheckout } from "../lib/checkout";
import "./Cart.css";

/**
 * The cart opens from "Cart (n)" in the nav, just under the top line, and
 * pushes the page down as it opens. Its height is shared as --cart-h so the
 * page and an open tea move down by exactly that much.
 */
export function Cart() {
  const lines = useCart();
  const open = useCartOpen() && lines.length > 0;
  const box = useRef<HTMLElement>(null);
  const [checkout, setCheckout] = useState("Checkout");

  useEffect(() => {
    if (!lines.length) setCartOpen(false);
  }, [lines.length]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  // follow the cart's height every frame while it opens or closes
  useLayoutEffect(() => {
    const el = box.current!;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => root.style.setProperty("--cart-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--cart-h");
    };
  }, []);

  async function onCheckout() {
    setCheckout("One moment");
    setCheckout(await startCheckout(lines));
    setTimeout(() => setCheckout("Checkout"), 1600);
  }

  return (
    <aside ref={box} className={`cart${open ? " is-open" : ""}`} aria-label="Cart" aria-hidden={!open}>
      <div className="cart-body">
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
              Total <RollingText text={money(total(lines))} stagger={10} />
              <br />
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
