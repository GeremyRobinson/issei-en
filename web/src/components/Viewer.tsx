import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router";
import type { Tea } from "../data/teas";
import { TeaPage } from "./TeaPage";
import "./Viewer.css";

/*
 * An open tea, over the Index. Moving between teas is a native horizontal
 * scroll with CSS scroll-snap, so swiping on a phone and two-finger
 * scrolling on a trackpad both work without any JavaScript.
 */
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Viewer({ teas, slug }: { teas: Tea[]; slug: string }) {
  const navigate = useNavigate();
  const track = useRef<HTMLDivElement>(null);
  const index = Math.max(0, teas.findIndex((t) => t.slug === slug));

  // open on the tea that was clicked; the page behind stops scrolling
  useLayoutEffect(() => {
    const el = track.current!;
    el.scrollLeft = index * el.clientWidth;
    document.documentElement.classList.add("viewer-open");
    return () => document.documentElement.classList.remove("viewer-open");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // swiping: when the scroll settles on another tea, the address follows
  useEffect(() => {
    const el = track.current!;
    let t: ReturnType<typeof setTimeout>;
    const settle = () => {
      const tea = teas[Math.round(el.scrollLeft / el.clientWidth)];
      if (tea && tea.slug !== slug) navigate(`/index/${tea.slug}`, { replace: true });
    };
    const onScroll = () => (clearTimeout(t), (t = setTimeout(settle, 140)));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => (clearTimeout(t), el.removeEventListener("scroll", onScroll));
  }, [teas, slug, navigate]);

  // keys: ← → for the next tea, Esc back to the Index
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

  // phones: pull a tea down from its top to go back to the Index
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
      slide.style.transform = `translateY(${dy * 0.5}px)`;
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
    <div className="viewer" role="dialog" aria-label={`${teas[index]?.code}, ${teas[index]?.title}`}>
      <div className="viewer-track" ref={track}>
        {teas.map((t) => (
          <section className="viewer-slide" key={t.slug}>
            <TeaPage tea={t} active={t.slug === slug} />
          </section>
        ))}
      </div>
    </div>
  );
}
