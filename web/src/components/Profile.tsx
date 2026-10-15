import { useEffect, useState } from "react";
import type { Tea } from "../data/teas";
import "./Profile.css";

const ROAST = ["rgb(240,220,170)", "rgb(224,176,98)", "rgb(197,136,72)", "rgb(154,94,53)", "rgb(104,62,37)", "rgb(61,35,24)"];

/** Counts up in 0.1 steps when the page comes into view; shows the real value otherwise. */
function CountUp({ to, play }: { to: number; play: boolean }) {
  const [shown, setShown] = useState(to);
  useEffect(() => {
    if (!play || matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(to);
    const steps = Math.round(to * 10);
    let k = 0;
    setShown(0);
    const id = setInterval(() => {
      k++;
      setShown(Math.min(k, steps) / 10);
      if (k >= steps) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [to, play]);
  return <>{shown.toFixed(1)}</>;
}

/** Tasting data. The bars and scale play once in CSS when `play` turns on. */
export function Profile({ tea, play }: { tea: Tea; play: boolean }) {
  if (tea.type === "Matcha" && tea.sweetness) {
    const [a, c] = tea.sweetness.split(":").map((n) => parseInt(n, 10) || 0);
    return (
      <div className={play ? "profile is-playing" : "profile"}>
        <div className="lv">
          <span>Sweetness</span>
          <div>
            <span>{tea.sweetness}</span>
            <div className="bar">
              {Array.from({ length: a + c }, (_, i) => (
                <i key={i} style={{ background: i < a ? "var(--amino)" : "var(--catechin)", animationDelay: `${120 + i * 90}ms` }} />
              ))}
            </div>
            <div className="legend">
              <span style={{ "--c": "var(--amino)" } as React.CSSProperties}>Amino acids</span>
              <span style={{ "--c": "var(--catechin)" } as React.CSSProperties}>Catechin</span>
            </div>
          </div>
        </div>
        <div className="lv">
          <span>Umami</span>
          <span>
            <CountUp to={tea.umami ?? 0} play={play} />%{"  "}(L-theanine)
          </span>
        </div>
      </div>
    );
  }
  const level = Math.min(6, Math.max(1, Math.round(tea.roastLevel ?? 1)));
  return (
    <div className={play ? "profile is-playing" : "profile"}>
      <div className="lv">
        <span>Toast</span>
        <span>{tea.toast}</span>
      </div>
      <div className="lv">
        <span>Roast</span>
        <div>
          <span>{tea.roast}</span>
          <div className="scale">
            {ROAST.map((c, i) => (
              <i key={c} className={i === level - 1 ? "on" : undefined} style={{ background: c, animationDelay: `${100 + i * 60}ms` }} />
            ))}
          </div>
          <div className="scale-ends">
            <span>Light</span>
            <span>Dark</span>
          </div>
        </div>
      </div>
    </div>
  );
}
