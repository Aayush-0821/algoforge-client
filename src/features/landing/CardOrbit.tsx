"use client";

import { useEffect, useRef, useState } from "react";
import {
  MotionValue,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Quote } from "lucide-react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const GAP = 1.12; // arc length between card centres as a multiple of card width (1 = touching)

/* Short lines in AlgoForge's voice. Add or edit freely; the ring uses as many as it needs (max 16). */
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

type Dim = { R: number; w: number; h: number; n: number };

function QuoteCard({ i, step, dim, text, rotateY }: { i: number; step: number; dim: Dim; text: string; rotateY: MotionValue<number> }) {
  // fade with depth: full strength facing the viewer, softly dim toward the sides
  const opacity = useTransform(rotateY, (r) => {
    const a = (((i * step + r) % 360) + 360) % 360;
    const c = Math.cos((a * Math.PI) / 180);
    return 0.18 + 0.82 * Math.pow(Math.max(0, c), 0.7);
  });

  return (
    <div
      className="absolute left-1/2 top-1/2 [backface-visibility:hidden]"
      style={{
        width: dim.w,
        height: dim.h,
        marginLeft: -dim.w / 2,
        marginTop: -dim.h / 2,
        transform: `rotateY(${i * step}deg) translateZ(${dim.R}px) translateY(${((i % 3) - 1) * 30}px)`,
      }}
    >
      <motion.div
        style={{ opacity }}
        className="flex h-full flex-col justify-between rounded-2xl border border-white/12 bg-neutral-900/75 p-4 text-white shadow-[0_30px_60px_-24px_rgba(0,0,0,0.85)] will-change-transform md:p-5"
      >
        <Quote size={14} className="text-orange-500" />
        <p className="text-[14px] font-light leading-[1.45] text-neutral-100 md:text-[15px]">{text}</p>
        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
          <span className="h-px w-5 bg-gradient-to-r from-orange-500 to-transparent" />
          AlgoForge
        </div>
      </motion.div>
    </div>
  );
}

/* A tight ring of quote cards that sweeps up through the viewport as the hero hands off to the features. */
export default function CardOrbit() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // spring-smoothed scroll: wheel notches and trackpad flicks glide instead of stepping
  const spring = useSpring(scrollY, { stiffness: 70, damping: 22, mass: 0.5, restDelta: 0.05 });
  const sy = reduce ? scrollY : spring;

  const vh = useRef(900);
  const [dim, setDim] = useState<Dim>({ R: 560, w: 230, h: 128, n: 14 });

  useEffect(() => {
    const on = () => {
      vh.current = innerHeight;
      const mobile = innerWidth < 768;
      const R = mobile ? 250 : 560;
      const w = mobile ? 190 : 230;
      const h = mobile ? 112 : 128;
      const n = Math.min(QUOTES.length, Math.max(6, Math.round((2 * Math.PI * R) / (w * GAP))));
      setDim({ R, w, h, n });
    };
    on();
    addEventListener("resize", on);
    return () => removeEventListener("resize", on);
  }, []);

  const t = useTransform(sy, (v) => clamp((v - vh.current * 0.3) / (vh.current * 1.5)));
  const y = useTransform(t, (v) => (0.62 - 1.3 * v) * vh.current);
  const opacity = useTransform(t, [0, 0.12, 0.85, 1], [0, 1, 1, 0]);
  const display = useTransform(t, (v) => (v <= 0 || v >= 1 ? "none" : "block"));

  // slow constant drift so the ring feels alive even when scrolling pauses
  const idle = useMotionValue(0);
  useAnimationFrame((time) => {
    if (reduce) return;
    const v = t.get();
    if (v > 0 && v < 1) idle.set(time * 0.004);
  });
  const rotateY = useTransform([sy, idle], ([s, d]: number[]) => s * 0.14 + d);

  const step = 360 / dim.n;

  return (
    <motion.div aria-hidden style={{ opacity, display, perspective: 1600 }} className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      <motion.div style={{ y, rotateY, rotateX: -8, transformStyle: "preserve-3d" }} className="absolute inset-0 will-change-transform">
        {QUOTES.slice(0, dim.n).map((q, i) => (
          <QuoteCard key={i} i={i} step={step} dim={dim} text={q} rotateY={rotateY} />
        ))}
      </motion.div>
    </motion.div>
  );
}