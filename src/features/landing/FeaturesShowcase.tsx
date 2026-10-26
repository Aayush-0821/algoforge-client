"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { Braces, Code2, Cpu, Database, GitBranch, Globe, MousePointer2, RefreshCw, Terminal, Zap } from "lucide-react";

/* Apple-style type: SF Pro on Apple devices, Inter everywhere else. */
const inter = Inter({ subsets: ["latin"] });
const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", ${inter.style.fontFamily}, system-ui, sans-serif`;

const ease = [0.22, 1, 0.36, 1] as const;

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/* ───────────────────────── card shell ───────────────────────── */

function Card({ className = "", children, hero = false }: { className?: string; children: ReactNode; hero?: boolean }) {
  return (
    <motion.article
      variants={rise}
      className={`group relative overflow-hidden transition-colors duration-300 ${
        hero
          ? "rounded-[28px] border border-orange-300/30 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"
          : "rounded-[24px] border border-white/[0.07] bg-[#0d0c0b] hover:border-white/[0.16]"
      } ${className}`}
    >
      {children}
    </motion.article>
  );
}

/** Title (+ optional description) pinned to the bottom-left, like the reference. */
function Caption({ title, text, dark = false }: { title: string; text?: string; dark?: boolean }) {
  return (
    <div className="absolute inset-x-6 bottom-6">
      <h3 className={`text-[19px] font-medium leading-tight tracking-[-0.02em] ${dark ? "text-black" : "text-white"}`}>{title}</h3>
      {text && <p className={`mt-1.5 max-w-[250px] text-[13.5px] leading-5 ${dark ? "text-black/65" : "text-neutral-500"}`}>{text}</p>}
    </div>
  );
}

function Glow({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`pointer-events-none absolute rounded-full bg-orange-500/20 blur-3xl ${className}`} />;
}

/* ───────────────────────── 1 · hero card (the reference's lime card) ───────────────────────── */

function RoadmapCard() {
  return (
    <Card hero className="min-h-[240px] sm:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-span-3 lg:row-start-1">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/25 blur-3xl" />
      <Caption dark title="Personalized roadmap" text="A study plan built from the way you actually solve." />
    </Card>
  );
}

/* ───────────────────────── 2 · skill growth — rising line (reference: design iterations) ───────────────────────── */

function GrowthCard() {
  return (
    <Card className="min-h-[300px] lg:col-start-1 lg:row-span-3 lg:row-start-4">
      <Glow className="right-4 top-10 h-40 w-40" />

      {/* faint guides */}
      <div aria-hidden className="absolute inset-x-6 top-[30%] h-px bg-white/[0.05]" />
      <div aria-hidden className="absolute inset-x-6 top-[48%] h-px bg-white/[0.05]" />
      <span className="absolute left-6 top-[27%] -translate-y-1/2 text-[11px] tabular-nums text-neutral-600">92</span>

      <svg viewBox="0 0 200 120" preserveAspectRatio="none" className="absolute inset-x-0 top-5 h-[58%] w-full" aria-hidden>
        {/* where the line is heading */}
        <path d="M150 34 C 168 26, 182 14, 200 4" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <motion.path
          d="M0 112 C 22 110, 34 104, 52 98 S 80 92, 96 80 S 128 58, 150 34"
          fill="none"
          stroke="#fb923c"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0 8px rgba(249,115,22,0.7))" }}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, ease }}
        />
      </svg>

      {/* the glowing point */}
      <motion.span
        initial={{ opacity: 0, scale: 0.4 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 1.3, ease }}
        style={{ left: "75%", top: "calc(20px + 58% * 0.283)" }}
        className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500/25"
      >
        <span className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_14px_rgba(249,115,22,0.9)]" />
      </motion.span>

      <Caption title="Skill growth" text="Watch your problem-solving level climb, week after week." />
    </Card>
  );
}

/* ───────────────────────── 3 · smart recommendations (reference: invite people) ───────────────────────── */

function RecommendCard() {
  const rings = [
    { l: "E", ring: "ring-emerald-400", text: "text-emerald-300" },
    { l: "M", ring: "ring-orange-500", text: "text-orange-300" },
    { l: "H", ring: "ring-red-400", text: "text-red-300" },
  ];
  return (
    <Card className="min-h-[200px] lg:col-start-2 lg:row-span-2 lg:row-start-1">
      <Glow className="left-1/2 top-2 h-28 w-40 -translate-x-1/2" />
      <div className="absolute left-1/2 top-8 flex -translate-x-1/2 items-center">
        {rings.map((r, i) => (
          <motion.span
            key={r.l}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease }}
            style={{ zIndex: 3 - i }}
            className={`-ml-3 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-b from-[#26231f] to-[#14120f] text-[15px] font-semibold ring-[3px] ring-offset-[3px] ring-offset-[#0d0c0b] first:ml-0 ${r.ring} ${r.text}`}
          >
            {r.l}
          </motion.span>
        ))}
        <MousePointer2 size={16} className="-ml-1 mt-9 fill-white text-white" />
        <span className="-ml-1 mt-14 rounded-full bg-orange-400 px-3 py-1 text-[12px] font-semibold text-black">Two Sum II</span>
      </div>
      <Caption title="Smart recommendations" />
    </Card>
  );
}

/* ───────────────────────── 4 · instant feedback (reference: fast iterations) ───────────────────────── */

function FeedbackCard() {
  return (
    <Card className="min-h-[220px] lg:col-start-2 lg:row-span-2 lg:row-start-3">
      <div className="absolute inset-x-5 top-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease }}
          className="flex w-[72%] items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#161412] p-3"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black text-neutral-300">
            <RefreshCw size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-500">
              <span className="h-1 w-1 rounded-full bg-neutral-500" /> Analyzed
            </p>
            <span className="mt-1.5 block h-1.5 w-4/5 rounded-full bg-white/[0.08]" />
            <span className="mt-1.5 block h-1.5 w-3/5 rounded-full bg-white/[0.06]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="-mt-2 ml-auto flex w-[82%] items-center gap-3 rounded-2xl border border-white/10 bg-[#1d1a18] p-3 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-orange-400">
            <Zap size={17} />
          </span>
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-orange-400">
              <span className="h-1 w-1 rounded-full bg-orange-400" /> New
            </p>
            <p className="text-[14px] font-medium text-white">Slow loop found</p>
            <p className="text-[11px] text-neutral-500">Today, 11:50</p>
          </div>
        </motion.div>
      </div>
      <Caption title="Instant feedback" />
    </Card>
  );
}

/* ───────────────────────── 5 · your AI coach (reference: custom support) ───────────────────────── */

function CoachCard() {
  return (
    <Card className="min-h-[200px] lg:col-start-2 lg:row-span-2 lg:row-start-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease }}
        className="absolute inset-x-5 top-6 flex items-center gap-3"
      >
        <span className="relative shrink-0">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white">
            <Braces size={20} />
          </span>
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-[11px] font-bold text-black ring-2 ring-[#0d0c0b]">
            1
          </span>
        </span>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5">
          <p className="text-[10.5px] text-neutral-500">Forgey says:</p>
          <p className="text-[12.5px] leading-[1.35] text-neutral-100">Your window breaks on shrink. Want a hint?</p>
        </div>
      </motion.div>
      <Caption title="Your AI coach" />
    </Card>
  );
}

/* ───────────────────────── 6 · track progress — bars (reference: track progress) ───────────────────────── */

const BARS = [28, 52, 36, 64, 44, 78, 54, 92, 66, 100, 62, 84, 56, 72, 48];

function ProgressCard() {
  return (
    <Card className="min-h-[300px] lg:col-start-3 lg:row-span-3 lg:row-start-1">
      <div className="absolute -right-8 left-6 top-6 h-[52%] rounded-2xl border border-white/[0.08] bg-[#111010] p-4">
        <p className="text-[13px] font-medium text-orange-400">Activity</p>
        <div className="mt-3 flex h-[62%] items-end gap-[6px]">
          {BARS.map((h, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: i * 0.03, ease }}
              style={{ height: `${h}%`, transformOrigin: "bottom", opacity: 0.45 + h / 190 }}
              className="w-[7px] shrink-0 rounded-full bg-gradient-to-t from-orange-600 to-orange-300"
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between pr-10 text-[10px] text-neutral-600">
          <span>Mon</span>
          <span>Wed</span>
          <span>Today</span>
        </div>
      </div>
      <Caption title="Track progress" text="Weak topics found before the interview finds them." />
    </Card>
  );
}

/* ───────────────────────── 7 · always in sync — icon circles (reference: 100% integrated) ───────────────────────── */

function SyncCard() {
  const Dot = ({ Icon, accent = false }: { Icon: typeof Code2; accent?: boolean }) => (
    <span
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${
        accent ? "border-orange-400/40 bg-orange-500 text-black" : "border-white/10 bg-[#161412] text-neutral-200"
      }`}
    >
      <Icon size={21} />
    </span>
  );
  return (
    <Card className="min-h-[300px] lg:col-start-3 lg:row-span-3 lg:row-start-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease }}
        className="absolute inset-x-0 top-6 space-y-3.5"
      >
        <div className="flex justify-center gap-3.5">
          <Dot Icon={Globe} />
          <Dot Icon={Braces} accent />
          <Dot Icon={GitBranch} />
          <Dot Icon={Terminal} />
          <Dot Icon={Cpu} />
        </div>
        <div className="flex translate-x-9 justify-center gap-3.5">
          <Dot Icon={Code2} />
          <Dot Icon={Database} />
          <Dot Icon={Zap} />
          <Dot Icon={Globe} />
        </div>
      </motion.div>
      <Caption title="Always in sync" text="Install the extension once. Progress syncs as you solve." />
    </Card>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function FeaturesShowcase() {
  return (
    <section id="features" style={{ fontFamily: SF }} className="relative z-10 px-4 pb-16 pt-32 text-white sm:px-6 md:pt-40">
      <div className="mx-auto max-w-[1040px]">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
          className="text-center text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.1] tracking-[-0.035em]"
        >
          <span className="text-white">Everything you need </span>
          <span className="bg-gradient-to-b from-white/65 to-white/25 bg-clip-text text-transparent">to prep smarter</span>
        </motion.h2>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:grid-rows-[repeat(6,104px)]"
        >
          <RoadmapCard />
          <GrowthCard />
          <RecommendCard />
          <FeedbackCard />
          <CoachCard />
          <ProgressCard />
          <SyncCard />
        </motion.div>
      </div>
    </section>
  );
}