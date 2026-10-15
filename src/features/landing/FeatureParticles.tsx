"use client";

import { useEffect, useRef } from "react";

const PALETTE = ["249,115,22", "251,146,60", "253,186,116", "255,255,255"];
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

type Dot = { hx: number; hy: number; ox: number; oy: number; r: number; a: number; ph: number; sp: number; rgb: string };

/**
 * Particles that start bunched at the centre (like the hero sculpture) and
 * scatter evenly across the section as it scrolls in. Place it as the first
 * child of a `relative` section; it stays pinned behind the content (sticky).
 */
export default function FeatureParticles() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, raf = 0, visible = true;
    let dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // jittered grid = even coverage without clumps or gaps
      const count = w < 768 ? 420 : 1100;
      const cols = Math.max(1, Math.round(Math.sqrt((count * w) / h)));
      const rows = Math.max(1, Math.round(count / cols));
      const cw = w / cols, ch = h / rows;
      const spread = Math.min(w, h) * 0.14;

      dots = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.sqrt(Math.random()) * spread;
          const c = Math.random();
          dots.push({
            hx: (i + Math.random()) * cw,
            hy: (j + Math.random()) * ch,
            ox: w / 2 + Math.cos(ang) * rad,
            oy: h / 2 + Math.sin(ang) * rad,
            r: 0.6 + Math.random() * 1.4,
            a: 0.25 + Math.random() * 0.55,
            ph: Math.random() * 6.283,
            sp: 0.4 + Math.random() * 0.8,
            rgb: c < 0.5 ? PALETTE[0] : c < 0.75 ? PALETTE[1] : c < 0.9 ? PALETTE[2] : PALETTE[3],
          });
        }
      }
    };

    const draw = (time: number) => {
      if (visible && w) {
        const vh = innerHeight;
        const top = el.getBoundingClientRect().top;
        const p = reduce ? 1 : ease(clamp((vh - top) / (vh * 1.1)));
        const t = time / 1000;
        const cr = cv.getBoundingClientRect();
        const mx = mouse.x - cr.left, my = mouse.y - cr.top;

        ctx.clearRect(0, 0, w, h);
        for (const d of dots) {
          let x = d.ox + (d.hx - d.ox) * p;
          let y = d.oy + (d.hy - d.oy) * p;
          const amp = 6 * p;
          x += Math.sin(t * d.sp + d.ph) * amp;
          y += Math.cos(t * d.sp * 0.8 + d.ph) * amp;

          const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
          if (d2 < 14400) {
            const dist = Math.sqrt(d2) || 1;
            const f = (120 - dist) / 120;
            x += (dx / dist) * f * 28;
            y += (dy / dist) * f * 28;
          }

          ctx.fillStyle = `rgba(${d.rgb},${d.a * (0.35 + 0.65 * p)})`;
          ctx.beginPath();
          ctx.arc(x, y, d.r, 0, 6.283);
          ctx.fill();
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    const ro = new ResizeObserver(() => {
      build();
      if (reduce) draw(0);
    });

    build();
    io.observe(el);
    ro.observe(cv);
    addEventListener("pointermove", onMove, { passive: true });
    if (reduce) draw(0);
    else raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={host} aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="sticky top-0 h-screen w-full">
        <canvas ref={canvas} className="h-full w-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#060504_100%)] opacity-70" />
      </div>
    </div>
  );
}