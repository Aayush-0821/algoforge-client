"use client";

import { useEffect, useRef, useState } from "react";

export function useCountdown(endsAt: number | null, pausedLeftMs: number | null, onEnd: () => void) {
  const [left, setLeft] = useState(() => pausedLeftMs ?? (endsAt ? Math.max(0, endsAt - Date.now()) : 0));
  const endRef = useRef(onEnd);
  endRef.current = onEnd;

  useEffect(() => {
    if (pausedLeftMs != null) {
      setLeft(pausedLeftMs);
      return;
    }
    if (!endsAt) return;
    const tick = () => {
      const l = Math.max(0, endsAt - Date.now());
      setLeft(l);
      if (l === 0) {
        clearInterval(id);
        endRef.current();
      }
    };
    const id = setInterval(tick, 500);
    tick();
    return () => clearInterval(id);
  }, [endsAt, pausedLeftMs]);

  return left;
}

export function formatClock(ms: number) {
  const t = Math.ceil(ms / 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(t / 3600))}:${p(Math.floor((t % 3600) / 60))}:${p(t % 60)}`;
}