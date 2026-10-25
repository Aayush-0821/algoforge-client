"use client";

import { MouseEvent, ReactNode, createContext, useContext, useRef } from "react";
import { MotionValue, motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "framer-motion";

export const H1 = "text-5xl font-light leading-[0.95] tracking-[-0.04em] text-white md:text-7xl lg:text-[88px]";
export const P = "text-sm leading-6 text-neutral-400 md:text-[15px]";
export const TAG = "font-mono text-[11px] tracking-[0.2em] text-neutral-500";
export const EASE = [0.22, 1, 0.36, 1] as const;

type Ctx = { p: MotionValue<number>; first: boolean };
const SceneCtx = createContext<Ctx | null>(null);

export function Scene({ id, first, children }: { id?: string; first?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const opacity = useTransform(
    scrollYProgress,
    first ? [0, 0.55, 0.8] : [0, 0.08, 0.55, 0.8],
    first ? [1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [0.55, 0.85], [0, -60]);
  const scale = useTransform(scrollYProgress, [0.55, 0.85], [1, 1.05]);
  return (
    <SceneCtx.Provider value={{ p: scrollYProgress, first: !!first }}>
      <section id={id} ref={ref} className="relative h-[200vh]">
        <motion.div style={{ opacity, y, scale }} className="sticky top-0 flex h-screen flex-col px-6 pb-10 pt-28 md:px-10">
          {children}
        </motion.div>
      </section>
    </SceneCtx.Provider>
  );
}

function Word({ w, i, className }: { w: string; i: number; className: string }) {
  const ctx = useContext(SceneCtx);
  const idle = useMotionValue(0);
  const p = ctx?.p ?? idle;
  const s = 0.02 + i * 0.03;
  const y = useTransform(p, [s, s + 0.1], ["110%", "0%"]);
  const opacity = useTransform(p, [s, s + 0.06], [0, 1]);
  const blur = useTransform(p, [s, s + 0.1], [10, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const from = { y: "110%", opacity: 0, filter: "blur(10px)" };
  const to = { y: "0%", opacity: 1, filter: "blur(0px)" };

  if (!ctx || ctx.first) {
    const delay = ctx ? 0.25 + i * 0.08 : i * 0.07;
    const trigger = ctx ? { animate: to } : { whileInView: to, viewport: { once: true, margin: "-10%" } };
    return (
      <motion.span initial={from} {...trigger} transition={{ duration: 1, delay, ease: EASE }} className={`inline-block ${className}`}>
        {w}
      </motion.span>
    );
  }
  return (
    <motion.span style={{ y, opacity, filter }} className={`inline-block ${className}`}>
      {w}
    </motion.span>
  );
}

export function Words({ text, className = "", offset = 0 }: { text: string; className?: string; offset?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-bottom">
          <Word w={w} i={i + offset} className={className} />
        </span>
      ))}
    </>
  );
}

export function Rise({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ctx = useContext(SceneCtx);
  const idle = useMotionValue(0);
  const p = ctx?.p ?? idle;
  const s = 0.1 + delay;
  const y = useTransform(p, [s, s + 0.15], [40, 0]);
  const opacity = useTransform(p, [s, s + 0.1], [0, 1]);
  if (ctx?.first) {
    return (
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.7 + delay * 4, ease: EASE }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ y: 28, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SpotCard({ children, className = "", paper = false }: { children: ReactNode; className?: string; paper?: boolean }) {
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const skin = paper
    ? "border-black/10 bg-white/70 hover:border-orange-500/40 dark:border-white/10 dark:bg-white/[0.03]"
    : "border-white/10 bg-white/[0.03] hover:border-white/25";
  return (
    <div onMouseMove={move} className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors duration-300 ${skin} ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(249,115,22,0.20), transparent 70%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <motion.div className="flex w-max" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, ease: "linear", repeat: Infinity }}>
        {row.map((t, i) => (
          <span key={i} className={`${TAG} px-4 py-2 text-xs text-neutral-300`}>
            [ {t.toUpperCase()} ]
          </span>
        ))}
      </motion.div>
    </div>
  );
}