"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export default function SplitPane({ left, right, initial = 44, min = 28, max = 70 }: { left: ReactNode; right: ReactNode; initial?: number; min?: number; max?: number }) {
  const [pct, setPct] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const onMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setPct(Math.min(max, Math.max(min, ((e.clientX - r.left) / r.width) * 100)));
    },
    [min, max],
  );

  useEffect(() => {
    const up = () => {
      dragging.current = false;
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", up);
    };
  }, [onMove]);

  return (
    <div ref={ref} className="flex h-full w-full overflow-hidden">
      <div style={{ width: `${pct}%` }} className="h-full min-w-0 overflow-hidden">{left}</div>
      <div
        role="separator"
        aria-orientation="vertical"
        onPointerDown={() => {
          dragging.current = true;
          document.body.style.userSelect = "none";
        }}
        className="group flex w-3 shrink-0 cursor-col-resize items-center justify-center"
      >
        <span className="h-12 w-1 rounded-full bg-white/80 shadow transition-colors group-hover:bg-slate-900" />
      </div>
      <div className="h-full min-w-0 flex-1 overflow-hidden">{right}</div>
    </div>
  );
}