"use client";

import { useRef, useState, useEffect } from "react";

// Product description that collapses to a few lines with an arrow to expand.
export default function CollapsibleDesc({ text, lines = 5 }: { text: string; lines?: number }) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  // Detect whether the text is long enough to need a toggle (measured while clamped).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 2);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text, lines]);

  return (
    <div className="pdp-desc-wrap">
      <p
        ref={ref}
        className={`pdp-desc ${expanded ? "is-open" : "is-clamped"}`}
        style={expanded ? undefined : { WebkitLineClamp: lines }}
      >
        {text}
      </p>
      {overflowing && (
        <button
          type="button"
          className="pdp-desc-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Скрий" : "Прочети повече"}
          <span className={`pdp-desc-caret${expanded ? " up" : ""}`} aria-hidden="true">
            ▾
          </span>
        </button>
      )}
    </div>
  );
}
