"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionValue, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Newsreader } from "next/font/google";

import { FEATURES } from "./features/features";

const serif = Newsreader({ subsets: ["latin"], weight: ["400"] });

const N = FEATURES.length;
const VH_PER_ITEM = 45; // scroll distance each feature stays active (desktop)
const SECTION_VH = N * VH_PER_ITEM + 100; // pinned time + one screen to scroll out

/* ---------- per-feature ambient glow (colored backdrop inside each card) ---------- */
const GLOWS = [
  "bg-[radial-gradient(circle_at_50%_88%,rgba(249,115,22,0.30),transparent_65%)]",   // 1 · habits — ember
  "bg-[radial-gradient(circle_at_28%_28%,rgba(244,63,94,0.24),transparent_62%)]",    // 2 · weak spots — rose
  "bg-[radial-gradient(circle_at_72%_22%,rgba(167,139,250,0.26),transparent_62%)]",  // 3 · roadmap — violet
  "bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.22),transparent_62%)]",   // 4 · AI — cyan
  "bg-[radial-gradient(circle_at_50%_55%,rgba(52,211,153,0.24),transparent_62%)]",   // 5 · sync — emerald
  "bg-[radial-gradient(circle_at_50%_38%,rgba(250,204,21,0.20),transparent_62%)]",   // 6 · readiness — gold
];

/* ═══════════════ 1 · Habit analysis — breathing bar chart ═══════════════ */
function BarsVisual() {
  const hs = [38, 62, 45, 80, 55, 92, 70, 50, 85, 64, 74, 48];
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-[6px] px-10 pb-14 pt-14">
      {hs.map((h, i) => (
        <motion.span
          key={i}
          className="max-w-[14px] flex-1 rounded-t-lg bg-gradient-to-t from-orange-600 via-orange-400 to-amber-300"
          style={{ opacity: 0.45 + (h / 100) * 0.55 }}
          animate={{ height: [`${h * 0.55}%`, `${h}%`, `${h * 0.55}%`] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

/* ═══════════════ 2 · Weak concept detection — pulsing heat grid ═══════════════ */
function HeatmapVisual() {
  const hot = new Set([2, 7, 9, 14, 20, 23]);
  return (
    <div className="absolute inset-0 grid grid-cols-6 place-items-center gap-3 px-14 py-16">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className={`h-3.5 w-3.5 rounded-full ${
            hot.has(i)
              ? "bg-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.9)]"
              : "bg-white/10"
          }`}
          animate={hot.has(i) ? { scale: [1, 1.55, 1], opacity: [0.8, 1, 0.8] } : {}}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}

/* ═══════════════ 3 · Personalized roadmap — path drawing with pulsing nodes ═══════════════ */
const ROADMAP_D = "M30 250 C 110 250, 90 170, 170 165 S 250 240, 320 190 S 360 70, 370 60";
const ROADMAP_NODES = [
  [30, 250], [170, 165], [320, 190], [370, 60],
];

function RoadmapVisual() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full p-8">
      <defs>
        <linearGradient id="rm-grad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="55%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>

      {/* dashed base route */}
      <path d={ROADMAP_D} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 7" strokeLinecap="round" />

      {/* animated gradient route */}
      <motion.path
        d={ROADMAP_D}
        fill="none"
        stroke="url(#rm-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
      />

      {/* milestone nodes */}
      {ROADMAP_NODES.map(([x, y], i) => (
        <g key={i}>
          <motion.circle
            cx={x} cy={y} fill="none" stroke="#fbbf24" strokeWidth="1.5"
            animate={{ r: [6, 14], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
          />
          <motion.circle
            cx={x} cy={y} r="4" fill="#fff7ed"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.45 }}
          />
        </g>
      ))}

      {/* flag at the finish */}
      <g transform="translate(370 60)">
        <line x1="0" y1="0" x2="0" y2="-26" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <motion.path
          d="M0 -26 L 18 -21 L 0 -15 Z" fill="#fbbf24"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </g>
    </svg>
  );
}

/* ═══════════════ 4 · AI recommendations — orbiting topic chips ═══════════════ */
function OrbitVisual() {
  const chips = [
    { label: "DP", pos: "top-0 left-1/2 -ml-7" },
    { label: "Graphs", pos: "bottom-5 left-1" },
    { label: "Trees", pos: "bottom-5 right-1" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative h-52 w-52"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {/* rings */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-8 rounded-full border border-dashed border-cyan-300/20" />

        {/* orbiting chips (counter-rotated so text stays upright) */}
        {chips.map((c) => (
          <motion.span
            key={c.label}
            className={`absolute ${c.pos} rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-medium text-cyan-200 backdrop-blur-sm`}
            animate={{ rotate: -360 }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          >
            {c.label}
          </motion.span>
        ))}
      </motion.div>

      {/* core */}
      <div className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_0_40px_rgba(249,115,22,0.55)]">
        <span className="text-sm font-semibold text-white">AI</span>
      </div>
    </div>
  );
}

/* ═══════════════ 5 · Progress sync — expanding rings + connected windows ═══════════════ */
function SyncVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-0 px-10">
      {/* left window */}
      <div className="z-10 w-24 shrink-0 rounded-lg border border-emerald-300/25 bg-neutral-900/80 p-2 backdrop-blur-sm">
        <div className="flex gap-1">
          <i className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
          <i className="h-1.5 w-1.5 rounded-full bg-yellow-400/70" />
          <i className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="mt-2 space-y-1">
          <div className="h-1 rounded bg-emerald-400/40" />
          <div className="h-1 w-3/4 rounded bg-white/15" />
          <div className="h-1 w-1/2 rounded bg-white/15" />
        </div>
      </div>

      {/* connector with flowing dashes */}
      <svg width="70" height="20" className="shrink-0">
        <motion.line
          x1="0" y1="10" x2="70" y2="10"
          stroke="#34d399" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* core hub */}
      <div className="relative flex shrink-0 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute h-14 w-14 rounded-full border border-emerald-400/50"
            animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.85, ease: "easeOut" }}
          />
        ))}
        <div className="h-5 w-5 rounded-full bg-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.9)]" />
      </div>

      {/* connector */}
      <svg width="70" height="20" className="shrink-0">
        <motion.line
          x1="0" y1="10" x2="70" y2="10"
          stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* right window */}
      <div className="z-10 w-24 shrink-0 rounded-lg border border-cyan-300/25 bg-neutral-900/80 p-2 backdrop-blur-sm">
        <div className="flex gap-1">
          <i className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
          <i className="h-1.5 w-1.5 rounded-full bg-yellow-400/70" />
          <i className="h-1.5 w-1.5 rounded-full bg-cyan-400/70" />
        </div>
        <div className="mt-2 space-y-1">
          <div className="h-1 rounded bg-cyan-400/40" />
          <div className="h-1 w-3/4 rounded bg-white/15" />
          <div className="h-1 w-1/2 rounded bg-white/15" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ 6 · Interview readiness — glowing score ring ═══════════════ */
function GaugeVisual() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* sweep hand */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 0deg, rgba(250,204,21,0.35), transparent 60deg)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <div
          className="relative h-40 w-40 rounded-full p-2"
          style={{ background: "conic-gradient(#fb923c, #facc15, #34d399, rgba(255,255,255,0.08) 78%)" }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-neutral-950">
            <motion.span
              className="text-5xl font-light tracking-tight text-white"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              92
            </motion.span>
            <span className="mt-1 text-[10px] tracking-[0.25em] text-neutral-500">READY</span>
          </div>
        </div>
      </div>

      <motion.span
        className="rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-xs text-amber-200 backdrop-blur-sm"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Offer-ready
      </motion.span>
    </div>
  );
}

const VISUALS = [BarsVisual, HeatmapVisual, RoadmapVisual, OrbitVisual, SyncVisual, GaugeVisual];

/* ---------- right-side card: crossfade + gentle scale per scroll segment ---------- */
function FeatureVisual({
  index, total, progress, title,
}: {
  index: number; total: number; progress: MotionValue<number>; title: string;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = start + seg;
  const fade = seg * 0.3;

  const ranges = index === 0 ? [0, end - fade, end] : [start, start + fade, end - fade, end];
  const opacities = index === 0 ? [1, 1, 0] : [0, 1, 1, 0];

  const opacity = useTransform(progress, ranges, opacities);
  const scale = useTransform(progress, [start, start + fade], [1.04, 1]);

  const V = VISUALS[index % VISUALS.length];

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0 will-change-transform">
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-sm">
        {/* ambient glow for this feature */}
        <div aria-hidden className={`absolute inset-0 ${GLOWS[index % GLOWS.length]}`} />
        <V />
        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>
    </motion.div>
  );
}

/* ---------- section ---------- */
export default function FeaturesShowcase() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // 0 → 1 across the pinned part of the section
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(N - 1, Math.max(0, Math.floor(p * N))));
  });

  const pick = (i: number) => {
    const el = ref.current;
    if (!desktop || !el) return setActive(i);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((i + 0.5) / N) * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const cur = FEATURES[active];

  return (
    <section
      id="features"
      ref={ref}
      style={{ "--h": `${SECTION_VH}vh` } as CSSProperties}
      className="relative z-10 text-white [overflow:clip] lg:h-[var(--h)]"
    >
      {/* transparent layer — no bg, no borders; particles show through */}
      <div className="relative lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-16 px-8 md:px-12 lg:grid-cols-2">
          {/* left — headline + 6 points, no lines, no boxes */}
          <div>
            <h2
              className={`${serif.className} max-w-[560px] text-[clamp(1.75rem,3.1vw,2.7rem)] leading-[1.18] tracking-[-0.02em]`}
            >
              <span className="text-white">Everything you need to prep smarter.</span>
            </h2>

            <ul className="mt-10 space-y-7">
              {FEATURES.map((f, i) => {
                const on = i === active;
                return (
                  <li key={f.id}>
                    <button onClick={() => pick(i)} aria-expanded={on} className="flex w-full items-start gap-5 text-left">
                      <f.icon
                        size={18}
                        className={`mt-0.5 shrink-0 transition-colors duration-500 ${on ? "text-orange-500" : "text-neutral-600"}`}
                      />
                      <span className="block">
                        <span
                          className={`block text-[17px] transition-colors duration-500 md:text-xl ${
                            on ? "text-white" : "text-neutral-500"
                          }`}
                        >
                          {f.title}
                        </span>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                              className="block overflow-hidden"
                            >
                              <span className="mt-3 block max-w-md text-[15px] leading-7 text-neutral-400">
                                {f.description}
                              </span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* right — visual cards crossfading 1 → 6 (desktop only) */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] w-full">
              {FEATURES.map((f, i) => (
                <FeatureVisual key={f.id} index={i} total={N} progress={scrollYProgress} title={f.title} />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-neutral-500">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="truncate pr-4"
                >
                  {cur.title}
                </motion.span>
              </AnimatePresence>
              <span className="font-mono tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}