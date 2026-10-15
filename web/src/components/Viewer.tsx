import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router";
import type { Tea } from "../data/teas";
import { TeaPage } from "./TeaPage";
import "./Viewer.css";

/*
 * The Index zoom. Opening a tea grows its tile image into the first image of
 * the tea page; closing shrinks it back into the tile. Moving between teas is
 * a native horizontal scroll with CSS scroll-snap, so swiping on a phone and
 * two-finger scrolling on a trackpad both work without any JavaScript.
 *
 * JavaScript only measures where the tile and the page image are, and moves a
 * copy of the image between them with a CSS transition.
 */

let pendingZoom: string | null = null;
/** Called when a tile is clicked, so the viewer knows to zoom from it. */
export const zoomFromTile = (slug: string) => {
  pendingZoom = slug;
};

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const tileImage = (slug: string) => document.querySelector<HTMLImageElement>(`[data-tile="${slug}"] img`);

/** The page image nearest the top of the screen: the powder on desktop, the origin photograph on mobile. */
function pageImage(slide: Element | null): HTMLImageElement | null {
  const imgs = [...(slide?.querySelectorAll<HTMLImageElement>("figure img") ?? [])];
  const visible = imgs.map((img) => ({ img, r: img.getBoundingClientRect() })).filter(({ r }) => r.bottom > 0 && r.top < innerHeight);
  visible.sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left);
  return visible[0]?.img ?? null;
}

/** Move a copy of an image from one box to another, then remove it. */
function glide(src: string, from: DOMRect, to: DOMRect, ms = 420): Promise<void> {
  const ghost = document.createElement("img");
  ghost.src = src;
  ghost.className = "viewer-ghost";
  Object.assign(ghost.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
  document.body.appendChild(ghost);
  ghost.getBoundingClientRect(); // start the transition from here
  ghost.style.transitionDuration = `${ms}ms`;
  Object.assign(ghost.style, { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` });
  return new Promise((done) => {
    let finished = false;
    const end = () => {
      if (finished) return;
      finished = true;
      ghost.classList.add("is-done");
      setTimeout(() => ghost.remove(), 200);
      done();
    };
    ghost.addEventListener("transitionend", end, { once: true });
    setTimeout(end, ms + 80);
  });
}

export function Viewer({ teas, slug, closing, onClosed }: { teas: Tea[]; slug: string; closing: boolean; onClosed: () => void }) {
  const navigate = useNavigate();
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const index = Math.max(0, teas.findIndex((t) => t.slug === slug));

  // open: jump to the tea, then zoom from its tile if it was clicked
  useLayoutEffect(() => {
    const el = track.current!;
    el.scrollLeft = index * el.clientWidth;
    document.documentElement.classList.add("viewer-open");
    const from = pendingZoom === slug ? tileImage(slug) : null;
    pendingZoom = null;
    if (!from || reduceMotion()) return;
    const target = pageImage(el.children[index]);
    if (!target) return;
    root.current!.classList.add("is-zooming");
    target.style.visibility = "hidden";
    glide(from.currentSrc || from.src, from.getBoundingClientRect(), target.getBoundingClientRect()).then(() => {
      target.style.visibility = "";
      root.current?.classList.remove("is-zooming");
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => document.documentElement.classList.remove("viewer-open"), []);

  // close: shrink the current tea back into its tile
  useEffect(() => {
    if (!closing) return;
    const current = teas[index];
    const tile = current && tileImage(current.slug);
    const from = pageImage(track.current?.children[index] ?? null);
    root.current!.classList.add("is-closing");
    document.documentElement.classList.remove("viewer-open");
    if (!tile || !from || reduceMotion()) return onClosed();
    tile.scrollIntoView({ block: "nearest" });
    from.style.visibility = "hidden";
    glide(tile.currentSrc || tile.src, from.getBoundingClientRect(), tile.getBoundingClientRect(), 380).then(onClosed);
  }, [closing]); // eslint-disable-line react-hooks/exhaustive-deps

  // swiping: when the scroll settles on another tea, the address follows
  useEffect(() => {
    const el = track.current!;
    let t: ReturnType<typeof setTimeout>;
    const settle = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      const tea = teas[i];
      if (tea && tea.slug !== slug && !closing) navigate(`/index/${tea.slug}`, { replace: true });
    };
    const onScroll = () => (clearTimeout(t), (t = setTimeout(settle, 140)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => (clearTimeout(t), el.removeEventListener("scroll", onScroll));
  }, [teas, slug, closing, navigate]);

  // keys: ← → for the next tea, Esc to zoom back out
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      const el = track.current!;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        el.scrollBy({ left: (e.key === "ArrowRight" ? 1 : -1) * el.clientWidth, behavior: reduceMotion() ? "auto" : "smooth" });
      }
      if (e.key === "Escape") navigate("/index");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  // phones: pull a tea down from its top to zoom back out
  useEffect(() => {
    const el = track.current!;
    let y0: number | null = null, slide: HTMLElement | null = null, dy = 0;
    const start = (e: TouchEvent) => {
      slide = (e.target as HTMLElement).closest(".viewer-slide");
      y0 = slide && slide.scrollTop <= 0 ? e.touches[0].clientY : null;
      dy = 0;
    };
    const move = (e: TouchEvent) => {
      if (y0 === null || !slide) return;
      dy = e.touches[0].clientY - y0;
      if (dy <= 0) return;
      e.preventDefault();
      slide.style.transform = `translateY(${dy * 0.5}px) scale(${1 - Math.min(dy, 400) / 2000})`;
    };
    const end = () => {
      if (slide) slide.style.transform = "";
      if (y0 !== null && dy > 110) navigate("/index");
      y0 = null;
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    return () => (el.removeEventListener("touchstart", start), el.removeEventListener("touchmove", move), el.removeEventListener("touchend", end));
  }, [navigate]);

  return (
    <div className="viewer" ref={root} role="dialog" aria-label={`${teas[index]?.code}, ${teas[index]?.title}`}>
      <div className="viewer-track" ref={track}>
        {teas.map((t) => (
          <section className="viewer-slide" key={t.slug}>
            <TeaPage tea={t} active={t.slug === slug && !closing} />
          </section>
        ))}
      </div>
    </div>
  );
}
