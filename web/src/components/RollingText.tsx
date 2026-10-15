import { useState } from "react";
import "./RollingText.css";

/**
 * Text whose characters roll when they change: the old character slides up
 * and out, the new one slides in from below. The motion is pure CSS; React
 * only works out which characters changed.
 */
export function RollingText({ text, stagger = 0 }: { text: string; stagger?: number }) {
  const [state, setState] = useState({ text, prev: text, v: 0 });
  if (state.text !== text) setState({ text, prev: state.text, v: state.v + 1 });
  const prev = [...state.prev];

  return (
    <span className="roll" aria-label={text}>
      {[...text].map((c, i) => {
        const was = prev[i];
        const changed = state.v > 0 && was !== c;
        const delay = changed ? { animationDelay: `${i * stagger}ms` } : undefined;
        return (
          <span className="roll-ch" key={i} aria-hidden="true">
            {changed && was !== undefined && (
              <i className="roll-out" key={`o${state.v}`} style={delay}>
                {was}
              </i>
            )}
            <i className={changed ? "roll-in" : undefined} key={changed ? `i${state.v}` : "s"} style={delay}>
              {c}
            </i>
          </span>
        );
      })}
    </span>
  );
}
