import { useSyncExternalStore } from "react";
import { teaBySlug } from "../data/teas";

export type Line = { slug: string; qty: number };

/* pure updates, so they are easy to test */
export function add(lines: Line[], slug: string): Line[] {
  return lines.some((l) => l.slug === slug)
    ? lines.map((l) => (l.slug === slug ? { ...l, qty: l.qty + 1 } : l))
    : [...lines, { slug, qty: 1 }];
}
export function setQty(lines: Line[], slug: string, qty: number): Line[] {
  return qty < 1 ? remove(lines, slug) : lines.map((l) => (l.slug === slug ? { ...l, qty } : l));
}
export function remove(lines: Line[], slug: string): Line[] {
  return lines.filter((l) => l.slug !== slug);
}
export const unitPrice = (slug: string) => teaBySlug(slug)?.retail?.price ?? 0;
export const count = (lines: Line[]) => lines.reduce((n, l) => n + l.qty, 0);
export const total = (lines: Line[]) => lines.reduce((s, l) => s + unitPrice(l.slug) * l.qty, 0);

/* one cart for the whole site, kept in this browser between visits */
const KEY = "issei-en-cart";
const listeners = new Set<() => void>();
let lines: Line[] = load();

function load(): Line[] {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((l) => teaBySlug(l?.slug)?.retail && l.qty > 0) : [];
  } catch {
    return [];
  }
}
function commit(next: Line[]) {
  lines = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* private mode: the cart still works for this visit */
  }
  listeners.forEach((l) => l());
}

export const cart = {
  add: (slug: string) => commit(add(lines, slug)),
  setQty: (slug: string, qty: number) => commit(setQty(lines, slug, qty)),
  remove: (slug: string) => commit(remove(lines, slug)),
};

export function useCart(): Line[] {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => lines,
    () => lines,
  );
}

/* whether the cart is open, shared by the nav and the cart itself */
let isOpen = false;
const openListeners = new Set<() => void>();
export function setCartOpen(open: boolean) {
  if (open === isOpen) return;
  isOpen = open;
  openListeners.forEach((l) => l());
}
export function useCartOpen(): boolean {
  return useSyncExternalStore(
    (l) => (openListeners.add(l), () => openListeners.delete(l)),
    () => isOpen,
    () => isOpen,
  );
}
