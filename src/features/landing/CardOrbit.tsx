"use client";

import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

/* Short lines in AlgoForge's voice. Add or edit freely (max 16). */
const QUOTES = [
  "Stop solving. Start forging.",
  "Forgey studies how you solve problems, not just whether you did.",
  "Install once. Everything else just works.",
  "Your weak topics, found before the interview finds them.",
  "A roadmap built from your own coding habits.",
  "Master the pattern, not just the problem.",
  "Interview-ready skills, right where you solve.",
  "Every submission teaches the next one.",
  "Crack coding interviews with confidence.",
  "Know why it was slow, not only that it failed.",
  "Your progress syncs automatically as you solve.",
  "Practice that adapts to the way you think.",
  "From brute force to optimal, one nudge at a time.",
  "Less grinding. More forging.",
  "Solve it. Understand it. Own it.",
  "Spot the weak concept before it costs you.",
];

/*
 * Timeline (all driven by window scroll):
 *   0.05 – 0.50 vh  hero content fades out            (HeroFade in LandingPage)
 *   START …         quotes rise from the bottom edge as a tall, narrow twisting column;
 *                   the particles start scattering here too (ParticleField reads orbitTimeline)
 *   … s1            the last quote leaves the top; <OrbitSpacer /> sizes itself so the features arrive right then
 */
const START = 0.18; // scroll (in viewport heights) where the quotes begin
const PAR = 1.25; // column travel per pixel of scroll (higher = faster sweep)
const PER_TURN = 6; // quotes per full turn of the helix
const HANDOFF = 0.38; // features' first content enters the screen this many viewport heights before the last quote is gone
const FEATURES_LEAD = 150; // px from the features section top to its first visible content (its top padding)

/** Single source of truth for sizes and scroll timing. */
export function metrics() {
  const w = typeof window === "undefined" ? 1440 : innerWidth;
  const vh = typeof window === "undefined" ? 900 : innerHeight;
  const mobile = w < 768;
  const n = mobile ? 9 : 12;
  const cw = mobile ? 190 : 230;
  const ch = mobile ? 112 : 128;
  const R = mobile ? 118 : 200;
  const dy = vh * (mobile ? 0.055 : 0.06);
  const travel = vh + 2 * ch + (n - 1) * dy;
  const s0 = START * vh;
  const s1 = s0 + travel / PAR;
  return { vh, n, cw, ch, R, dy, travel, s0, s1 };
}

/** Scroll positions (px) where the orbit starts and ends. */
export const orbitTimeline = () => {
  const m = metrics();
  return { s0: m.s0, s1: m.s1 };
};

/** Transparent scroll room after the hero. Measures itself so the features start the moment the orbit ends. */
export function OrbitSpacer() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const m = metrics();
      const top = el.getBoundingClientRect().top + scrollY; // where this spacer starts in the page
      const needed = m.s1 - HANDOFF * m.vh + m.vh - FEATURES_LEAD - top;
      const h = Math.max(0, Math.round(needed));
      if (Math.abs(el.offsetHeight - h) > 1) el.style.height = h + "px";
    };
    update();
    addEventListener("resize", update);
    addEventListener("load", update);
    const ro = new ResizeObserver(update);
    if (el.previousElementSibling) ro.observe(el.previousElementSibling);
    return () => {
      removeEventListener("resize", update);
      removeEventListener("load", update);
      ro.disconnect();
    };
  }, []);
  return <div ref={ref} aria-hidden style={{ height: "130vh" }} />;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const sstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export default function CardOrbit() {
  const root = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const [n, setN] = useState(12);

  useEffect(() => {
    const on = () => setN(metrics().n);
    on();
    addEventListener("resize", on);
    return () => removeEventListener("resize", on);
  }, []);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let m = metrics();
    const size = () => {
      m = metrics();
      rootEl.style.setProperty("--cw", m.cw + "px");
      rootEl.style.setProperty("--ch", m.ch + "px");
    };
    size();
    addEventListener("resize", size);

    let shown = false;
    const setShown = (v: boolean) => {
      if (v === shown) return;
      shown = v;
      rootEl.style.visibility = v ? "visible" : "hidden";
    };

    const render = (s: number, idle: number) => {
      const { vh, ch, R, dy, travel, s0, s1 } = m;
      const p = (s - s0) / (s1 - s0);
      if (p <= 0 || p >= 1) return setShown(false);
      setShown(true);

      const lead = vh / 2 + ch - p * travel; // y of the leading (top) card, relative to screen centre
      const spin = p * 600 + idle * 5; // scroll-driven turn + a slow constant drift

      for (let k = 0; k < n; k++) {
        const el = els.current[k];
        if (!el) continue;
        const y = lead + k * dy;
        const yn = y / (vh / 2);
        const a = k * (360 / PER_TURN) + spin + (y / vh) * 80; // the last term twists the column
        const c = Math.cos((a * Math.PI) / 180);
        // fade with depth, and fade in only as a card clears the bottom edge (out at the top)
        const edge = sstep(1.1, 0.7, yn) * sstep(-1.1, -0.7, yn);
        const o = (0.14 + 0.86 * Math.pow(Math.max(0, c), 0.8)) * edge;
        el.style.transform = `translate3d(0,${y.toFixed(1)}px,0) rotateY(${a.toFixed(2)}deg) translateZ(${R}px)`;
        el.style.opacity = o.toFixed(3);
      }
    };

    // One loop: exponential smoothing of the scroll position (frame-rate independent), no springs, no React.
    let target = scrollY, cur = scrollY, idle = 0, last = performance.now(), raf = 0;
    const onScroll = () => (target = scrollY);
    addEventListener("scroll", onScroll, { passive: true });

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      cur = reduce ? target : cur + (target - cur) * (1 - Math.exp(-dt * 12));
      if (Math.abs(target - cur) < 0.05) cur = target;
      if (!reduce) idle += dt;
      render(cur, idle);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", size);
    };
  }, [n]);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[8] overflow-hidden"
      style={{ visibility: "hidden", perspective: 1500 }}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(-6deg)" }}>
        {QUOTES.slice(0, n).map((q, i) => (
          <div
            key={i}
            ref={(el) => {
              els.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 [backface-visibility:hidden] will-change-[transform,opacity]"
            style={{
              width: "var(--cw)",
              height: "var(--ch)",
              marginLeft: "calc(var(--cw) / -2)",
              marginTop: "calc(var(--ch) / -2)",
              opacity: 0,
            }}
          >
            <div className="flex h-full flex-col justify-between rounded-2xl border border-white/12 bg-neutral-900/85 p-4 text-white shadow-[0_18px_36px_-18px_rgba(0,0,0,0.85)] md:p-5">
              <Quote size={14} className="text-orange-500" />
              <p className="text-[14px] font-light leading-[1.45] text-neutral-100 md:text-[15px]">{q}</p>
              <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                <span className="h-px w-5 bg-gradient-to-r from-orange-500 to-transparent" />
                AlgoForge
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
