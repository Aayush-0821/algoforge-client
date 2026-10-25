"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { Braces, Check, Code2, Cpu, Database, GitBranch, Globe, Terminal, TrendingUp } from "lucide-react";

import { FEATURES } from "./features/features";


const inter = Inter({ subsets: ["latin"] });
const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", ${inter.style.fontFamily}, system-ui, sans-serif`;

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="relative w-full max-w-[500px]">
      <div aria-hidden className="absolute -inset-10 -z-10 bg-[radial-gradient(circle,rgba(249,115,22,0.10),transparent_62%)]" />
      <div
        className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0c0a09]/80 p-6 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl ${className}`}
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {children}
      </div>
    </div>
  );
}

function Pill({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, delay, ease }}
      className="flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-[14px]"
    >
      <span className="text-neutral-500">{label}</span>
      <span className="h-4 w-px bg-white/10" />
      <span className="text-neutral-100">{value}</span>
    </motion.div>
  );
}

function Mark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-orange-400 to-orange-600 text-white ${className}`}>
      <Braces className="h-[55%] w-[55%]" />
    </span>
  );
}

function HabitsVisual() {
  const levels = Array.from({ length: 84 }, (_, i) => {
    const v = (i * 37 + 11) % 13;
    return v < 4 ? 0 : v < 7 ? 1 : v < 9 ? 2 : v < 11 ? 3 : 4;
  });
  const tone = [
    "bg-white/[0.06]",
    "bg-orange-500/25",
    "bg-orange-500/45",
    "bg-orange-500/70",
    "bg-orange-500",
  ];
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Shell>
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-medium text-neutral-200">Solving activity</span>
          <span className="text-neutral-500">Last 12 weeks</span>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ staggerChildren: 0.01 }}
          className="mt-5 grid grid-flow-col grid-rows-7 gap-1.5"
        >
          {levels.map((l, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.4, ease }}
              className={`aspect-square rounded-[5px] ${tone[l]}`}
            />
          ))}
        </motion.div>
      </Shell>
      <div className="flex flex-wrap justify-center gap-3">
        <Pill label="Avg. solve time" value="18 min" />
        <Pill label="Streak" value="12 days" delay={0.1} />
      </div>
    </div>
  );
}

function WeakVisual() {
  const topics: [string, number][] = [
    ["Arrays", 92],
    ["Hashing", 84],
    ["Trees", 61],
    ["Graphs", 44],
    ["Dynamic programming", 38],
  ];
  return (
    <Shell>
      <div className="flex items-center justify-between text-[13px]">
        <span className="font-medium text-neutral-200">Topic strength</span>
        <span className="text-neutral-500">2 need attention</span>
      </div>
      <div className="mt-6 space-y-5">
        {topics.map(([name, v], i) => {
          const weak = v < 50;
          return (
            <div key={name}>
              <div className="flex items-center justify-between text-[14px]">
                <span className="flex items-center gap-2.5 text-neutral-200">
                  {name}
                  {weak && (
                    <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[11px] font-medium text-orange-400">
                      Focus
                    </span>
                  )}
                </span>
                <span className="tabular-nums text-neutral-500">{v}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${v}%` }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 1, delay: i * 0.08, ease }}
                  className={`h-full rounded-full ${weak ? "bg-orange-500" : "bg-white/35"}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

function RoadmapVisual() {
  const back = [
    ["Week 4 · Graphs", 40],
    ["Week 3 · Trees", 26],
    ["Week 2 · Hashing", 13],
  ] as const;
  const steps: [string, "done" | "now" | "next"][] = [
    ["Two pointers", "done"],
    ["Sliding window", "done"],
    ["Hash maps", "now"],
    ["Binary search", "next"],
  ];
  return (
    <div className="relative w-full max-w-[500px] pt-[72px]">
      {back.map(([label, inset], k) => (
        <div
          key={label}
          style={{ left: inset, right: inset, top: k * 24 }}
          className="absolute h-14 rounded-t-2xl border border-b-0 border-white/10 bg-white/[0.035] px-4 pt-1.5 text-[11.5px] text-neutral-500"
        >
          {label}
        </div>
      ))}
      <Shell className="!rounded-[24px]">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-medium text-neutral-200">Week 1 · Foundations</span>
          <span className="text-neutral-500">2 / 4</span>
        </div>
        <ul className="mt-5 space-y-2.5">
          {steps.map(([name, state], i) => (
            <motion.li
              key={name}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: i * 0.09, ease }}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] ${
                state === "now" ? "border border-orange-500/30 bg-orange-500/10" : "border border-white/[0.06] bg-white/[0.03]"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  state === "done"
                    ? "bg-orange-500 text-black"
                    : state === "now"
                      ? "border border-orange-400"
                      : "border border-white/20"
                }`}
              >
                {state === "done" && <Check size={12} strokeWidth={3} />}
                {state === "now" && <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />}
              </span>
              <span className={state === "next" ? "text-neutral-500" : "text-neutral-100"}>{name}</span>
              {state === "now" && <span className="ml-auto text-[11px] text-orange-400">In progress</span>}
            </motion.li>
          ))}
        </ul>
      </Shell>
    </div>
  );
}

/* ───────────────────────── 4 · AI recommendations — a short conversation ───────────────────────── */

function CoachVisual() {
  const msg = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 0.6, delay, ease },
  });
  return (
    <Shell className="!p-0">
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-3 text-[13px] text-neutral-400">
        <span className="mr-1.5 text-neutral-600">#</span>coach
      </div>
      <div className="space-y-5 px-5 py-6">
        <motion.div {...msg(0)} className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/10 text-[13px] font-semibold text-neutral-200">
            Y
          </span>
          <div>
            <p className="text-[14px] font-semibold text-neutral-100">
              You <span className="ml-1 text-[11px] font-normal text-neutral-500">9:03 AM</span>
            </p>
            <p className="mt-0.5 text-[14px] leading-6 text-neutral-300">I keep getting stuck on sliding window problems.</p>
          </div>
        </motion.div>

        <motion.div {...msg(0.15)} className="flex gap-3">
          <Mark />
          <div>
            <p className="flex items-center gap-2 text-[14px] font-semibold text-neutral-100">
              AlgoForge
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-neutral-400">AI</span>
              <span className="text-[11px] font-normal text-neutral-500">9:03 AM</span>
            </p>
            <p className="mt-0.5 text-[14px] leading-6 text-neutral-300">
              Your last three attempts broke when shrinking the window. Try <span className="font-semibold text-white">Longest Substring Without Repeating Characters</span> next, then
              Minimum Window Substring.
            </p>
            <div className="mt-3 flex gap-2 text-[11.5px]">
              <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-orange-300">Medium</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-neutral-400">Sliding window</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
}


function SyncVisual() {
  const icons = [Code2, Terminal, Braces, GitBranch, Cpu, Database, Globe];
  const nodes = icons.map((Icon, i) => {
    const a = (Math.PI * (i + 0.5)) / icons.length; // spread across the upper half-circle
    return { Icon, x: 50 - 44 * Math.cos(a), y: 76 - 62 * Math.sin(a), o: 0.55 + 0.45 * Math.sin(a) };
  });
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[500px]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {nodes.map((n, i) => (
          <motion.line
            key={i}
            x1={50}
            y1={76}
            x2={n.x}
            y2={n.y}
            stroke="rgba(249,115,22,0.35)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeDasharray="3 5"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>

      {nodes.map(({ Icon, x, y, o }, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: o, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: i * 0.07, ease }}
          style={{ left: `${x}%`, top: `${y}%` }}
          className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-[#0c0a09]/90 text-neutral-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]"
        >
          <Icon size={17} />
        </motion.span>
      ))}

      <div className="absolute left-1/2 top-[76%] -translate-x-1/2 -translate-y-1/2">
        <motion.span
          className="absolute inset-0 rounded-full border border-orange-500/50"
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
        <Mark className="relative h-16 w-16 !rounded-full shadow-[0_0_50px_rgba(249,115,22,0.45)]" />
      </div>
      <div className="absolute left-1/2 top-[92%] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[13px] text-neutral-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Synced just now
      </div>
    </div>
  );
}


function ReadinessVisual() {
  const C = 2 * Math.PI * 54;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Shell className="flex flex-col items-center !py-8">
        <div className="relative h-[168px] w-[168px]">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#f97316"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              whileInView={{ strokeDashoffset: C * 0.08 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.6, ease }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[44px] font-semibold leading-none tracking-[-0.04em] text-white">92</span>
            <span className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-neutral-500">Ready</span>
          </div>
        </div>
        <span className="mt-5 flex items-center gap-1.5 text-[13px] text-emerald-400">
          <TrendingUp size={14} /> +6 this month
        </span>
      </Shell>
      <Pill label="Strongest" value="Arrays" />
      <Pill label="Focus next" value="Dynamic programming" delay={0.1} />
    </div>
  );
}

const VISUALS = [CoachVisual, WeakVisual, RoadmapVisual, CoachVisual, SyncVisual, ReadinessVisual];

function Row({ i }: { i: number }) {
  const f = FEATURES[i];
  const V = VISUALS[i % VISUALS.length];
  const flip = i % 2 === 1;

  return (
    <div className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-28">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease }}
        className={flip ? "lg:order-2" : ""}
      >
        
        <h3 className="mt-6 max-w-[520px] text-balance text-[clamp(2.25rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
          {f.title}
        </h3>
        <p className="mt-6 max-w-[440px] text-[17px] leading-8 text-neutral-400">{f.description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.1, ease }}
        className={`flex justify-center ${flip ? "lg:order-1 lg:justify-start" : "lg:justify-end"}`}
      >
        <V />
      </motion.div>
    </div>
  );
}

export default function FeaturesShowcase() {
  return (
    <section id="features" style={{ fontFamily: SF }} className="relative z-10 px-6 pb-16 pt-36 text-white md:pt-44">
      <div className="mx-auto max-w-[1180px]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease }}
          className="text-center"
        >
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium tracking-wide text-neutral-300 backdrop-blur-xl">
            Features
          </span>
          <h2 className="mt-6 text-[clamp(2.6rem,6.6vw,6rem)] font-semibold leading-[1] tracking-[-0.045em]">
            <span className="block text-white">Everything you need</span>
            <span className="block bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              to prep smarter.
            </span>
          </h2>
        </motion.div>

        <div className="mt-8 md:mt-12">
          {FEATURES.map((f, i) => (
            <Row key={f.id} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
