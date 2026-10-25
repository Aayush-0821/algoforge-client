"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Inter } from "next/font/google";
import {
  AppWindow,
  ArrowRight,
  BatteryFull,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  Puzzle,
  RefreshCw,
  RotateCw,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Wifi,
} from "lucide-react";

import { supportedPlatforms, chromeStoreStats } from "./extension/extension-data";
import { solution } from "./showcase/data";

const inter = Inter({ subsets: ["latin"] });
const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", ${inter.style.fontFamily}, system-ui, sans-serif`;

const ease = [0.22, 1, 0.36, 1] as const;

const LOGO_SRC = "/logo.png";

function Logo({ className }: { className: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <span className={`flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white ${className}`}>
        <Braces className="h-[58%] w-[58%]" />
      </span>
    );
  }
  return <img src={LOGO_SRC} alt="" className={className} onError={() => setOk(false)} />;
}

const platformName = (p: unknown): string => {
  if (typeof p === "string") return p;
  const o = (p ?? {}) as Record<string, unknown>;
  return String(o.name ?? o.title ?? o.label ?? "");
};

function Fit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.5);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setS(el.clientWidth / 1280);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <div style={{ width: 1280, height: 800, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
}

function MacBook({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full">

      <div aria-hidden className="absolute -bottom-8 left-1/2 h-14 w-[78%] -translate-x-1/2 rounded-full bg-orange-500/25 blur-3xl" />

      <div className="relative mx-auto w-[84.4%] rounded-t-[clamp(10px,1.7vw,20px)] border border-[#3a3a3d] bg-black px-[1.9%] pb-[2.6%] pt-[2.1%]">
        <span className="absolute left-1/2 top-[0.9%] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#1d1d20] ring-1 ring-[#2a2a2e]" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-[clamp(2px,0.4vw,5px)] bg-black">
          {children}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07),transparent_32%)]"
          />
        </div>
      </div>
      <div
        className="relative h-[clamp(9px,1.5vw,17px)] w-full border-t border-black/40 bg-gradient-to-b from-[#e8eaee] via-[#c9ccd2] to-[#8f939b]"
        style={{
          borderRadius:
            "0 0 clamp(10px,2vw,22px) clamp(10px,2vw,22px) / 0 0 clamp(6px,1.1vw,12px) clamp(6px,1.1vw,12px)",
        }}
      >
        <span className="absolute left-1/2 top-0 h-[58%] w-[17%] -translate-x-1/2 rounded-b-[10px] bg-gradient-to-b from-[#a9adb4] to-[#d3d6db]" />
      </div>
    </div>
  );
}

function MenuBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-30 flex h-[30px] items-center justify-between bg-black/35 px-5 text-[13px] text-white/90 backdrop-blur-xl">
      <div className="flex items-center gap-5">
        <span className="font-semibold">Chrome</span>
        {["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"].map((m) => (
          <span key={m} className="text-white/70">
            {m}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-white/80">
        <BatteryFull size={16} />
        <Wifi size={15} />
        <Search size={14} />
        <span>Mon 9:41 AM</span>
      </div>
    </div>
  );
}

function ChromeWindow({ shown }: { shown: boolean }) {
  const lines = solution.slice(0, 15);
  return (
    <div className="absolute left-[120px] top-[92px] z-10 flex h-[668px] w-[1040px] flex-col overflow-hidden rounded-[14px] border border-white/10 bg-[#1b1a19] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex h-[42px] shrink-0 items-end bg-[#232120] px-3">
        <div className="mb-[13px] flex items-center gap-2">
          <i className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <i className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <i className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-5 flex h-[34px] w-[230px] items-center gap-2 rounded-t-[10px] bg-[#1b1a19] px-3 text-[12.5px] text-neutral-200">
          <span className="h-3.5 w-3.5 rounded-[4px] bg-[#f89f1b]" />
          <span className="truncate">Two Sum - LeetCode</span>
          <span className="ml-auto text-neutral-500">×</span>
        </div>
        <span className="mb-2 ml-3 text-lg leading-none text-neutral-500">+</span>
      </div>
      <div className="flex h-[44px] shrink-0 items-center gap-3 border-b border-white/5 bg-[#1b1a19] px-4 text-neutral-400">
        <ChevronLeft size={17} />
        <ChevronRight size={17} className="text-neutral-600" />
        <RotateCw size={15} />
        <div className="ml-1 flex h-[30px] flex-1 items-center gap-2 rounded-full bg-[#2a2827] px-4 text-[12.5px] text-neutral-300">
          <Lock size={12} className="text-neutral-500" />
          leetcode.com/problems/two-sum
        </div>
        <Puzzle size={17} />
        <div className="relative">
          <Logo className="h-[26px] w-[26px] rounded-md" />
          <motion.span
            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-[#1b1a19]"
            animate={shown ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
        <span className="h-7 w-7 rounded-full bg-gradient-to-br from-neutral-500 to-neutral-700" />
      </div>
      <div className="flex min-h-0 flex-1 bg-[#161514]">

        <div className="w-[44%] border-r border-white/5 p-7">
          <h4 className="text-[24px] font-semibold tracking-tight text-white">1. Two Sum</h4>
          <div className="mt-3 flex gap-2 text-[11.5px]">
            <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 font-medium text-emerald-300">Easy</span>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-neutral-400">Array</span>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-neutral-400">Hash Table</span>
          </div>
          <p className="mt-5 text-[13.5px] leading-6 text-neutral-400">
            Given an array of integers nums and an integer target, return indices of the two numbers such that they add up
            to target.
          </p>
          <div className="mt-5 rounded-lg bg-white/[0.04] p-3.5 font-mono text-[12px] leading-6 text-neutral-300">
            <span className="text-neutral-500">Input: </span>nums = [2,7,11,15], target = 9
            <br />
            <span className="text-neutral-500">Output: </span>[0,1]
          </div>
          <div className="mt-6 space-y-2.5">
            <div className="h-2 w-full rounded bg-white/[0.06]" />
            <div className="h-2 w-5/6 rounded bg-white/[0.06]" />
            <div className="h-2 w-2/3 rounded bg-white/[0.06]" />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-10 items-center gap-4 border-b border-white/5 px-5 text-[12px] text-neutral-400">
            <span className="text-white">Code</span>
            <span>Python3</span>
          </div>
          <pre className="flex-1 overflow-hidden px-4 py-4 font-mono text-[12.5px] leading-[22px] text-neutral-200">
            {lines.map((l, n) => (
              <div
                key={l.id}
                className={`-mx-2 flex px-2 ${l.highlight ? "rounded border-l-2 border-orange-400 bg-orange-500/15" : ""}`}
              >
                <span className="w-7 shrink-0 select-none text-white/25">{n + 1}</span>
                <span className="whitespace-pre">{l.text || "\u00A0"}</span>
              </div>
            ))}
          </pre>
          <div className="flex h-[52px] items-center justify-between border-t border-white/5 px-5">
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={shown ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.5, ease }}
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-emerald-400"
            >
              <Check size={14} strokeWidth={3} /> Accepted
              <span className="ml-2 font-normal text-neutral-500">Runtime 0 ms</span>
            </motion.span>
            <div className="flex gap-2 text-[12px]">
              <span className="rounded-md bg-white/[0.07] px-3.5 py-1.5 text-neutral-300">Run</span>
              <span className="rounded-md bg-emerald-500 px-3.5 py-1.5 font-medium text-black">Submit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExtensionPopup({ shown }: { shown: boolean }) {
  const C = 188.5; // circumference of r=30
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={shown ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 1.3, duration: 0.7, ease }}
      style={{ transformOrigin: "85% 0%" }}
      className="absolute right-[126px] top-[186px] z-20 w-[340px] rounded-[22px] border border-white/10 bg-[#141312]/95 p-4 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
    >
      <span className="absolute -top-[7px] right-[56px] h-3.5 w-3.5 rotate-45 rounded-[3px] border-l border-t border-white/10 bg-[#141312]" />

      <div className="flex items-center gap-2.5">
        <Logo className="h-7 w-7 rounded-lg" />
        <span className="text-[14px] font-semibold tracking-tight text-white">AlgoForge</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Synced
        </span>
        <Settings size={14} className="text-neutral-500" />
      </div>
      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white/[0.04] p-4">
        <div className="relative h-[76px] w-[76px] shrink-0">
          <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90">
            <circle cx="38" cy="38" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <motion.circle
              cx="38"
              cy="38"
              r="30"
              fill="none"
              stroke="#fb923c"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={shown ? { strokeDashoffset: C * 0.22 } : {}}
              transition={{ delay: 1.6, duration: 1.4, ease }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[20px] font-semibold text-white">78</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-neutral-400">Interview readiness</p>
          <p className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-emerald-400">
            <TrendingUp size={12} /> +4% this week
          </p>
          <div className="mt-2.5 flex h-6 items-end gap-1">
            {[25, 35, 42, 30, 58, 72, 85].map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-t bg-orange-500"
                initial={{ height: 0 }}
                animate={shown ? { height: `${h}%` } : {}}
                transition={{ delay: 1.8 + i * 0.05, duration: 0.5, ease }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 p-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-300">
          <Target size={15} />
        </span>
        <div className="flex-1">
          <p className="text-[13px] font-medium text-white">Sliding Window</p>
          <p className="text-[11px] text-neutral-500">Weak topic detected</p>
        </div>
        <span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-[11px] font-medium text-rose-300">Revisit</span>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 p-3 text-black">
        <div className="flex-1">
          <p className="text-[11px] font-medium opacity-70">Next up</p>
          <p className="text-[13.5px] font-semibold">Binary Search · Medium</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/85 text-white">
          <ArrowRight size={15} />
        </span>
      </div>
    </motion.div>
  );
}


function Screen({ shown }: { shown: boolean }) {
  return (
    <Fit>
      <div className="relative h-[800px] w-[1280px] overflow-hidden text-white" style={{ fontFamily: SF }}>
        <div className="absolute inset-0 bg-[#0b0a09] bg-[radial-gradient(100%_85%_at_88%_0%,#c2410c_0%,transparent_58%),radial-gradient(85%_80%_at_0%_100%,#5b21b6_0%,transparent_60%),radial-gradient(60%_50%_at_50%_100%,#9a3412_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(115deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_30px)]" />

        <MenuBar />
        <ChromeWindow shown={shown} />
        <ExtensionPopup shown={shown} />
        
      </div>
    </Fit>
  );
}

function FloatChip({ className, delay, children }: { className: string; delay: number; children: ReactNode }) {
  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute z-20 hidden items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl lg:flex ${className}`}
    >
      {children}
    </motion.div>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.8, delay, ease },
});

export default function ExtensionShowcase() {
  const screen = useRef<HTMLDivElement>(null);
  const shown = useInView(screen, { once: true, amount: 0.4 });

  const stats = [
    [chromeStoreStats.rating, "Store rating"],
    [chromeStoreStats.users.replace(" Developers", ""), "Developers"],
    [String(supportedPlatforms.length), "Platforms"],
  ];

  return (
    <section
      id="extension"
      style={{ fontFamily: SF }}
      className="relative z-10 flex min-h-screen items-center px-6 py-28 text-white lg:h-screen lg:min-h-[700px] lg:py-0"
    >
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-14 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12">
        {/* text */}
        <div className="text-center lg:text-left">
         
          <motion.h2
            {...fade(0.05)}
            className="mt-6 text-[clamp(2.5rem,4.4vw,4rem)] font-semibold leading-[1] tracking-[-0.045em]"
          >
            <span className="block text-white">Install once.</span>
            <span className="block  text-white">
              Everything else just works.
            </span>
          </motion.h2>

          <motion.p {...fade(0.1)} className="mx-auto mt-6 max-w-sm text-[17px] leading-8 text-neutral-400 lg:mx-0">
            Add AlgoForge to Chrome and your progress syncs automatically as you solve.
          </motion.p>

          <motion.div {...fade(0.15)}>
            <button className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[15px] font-medium text-black shadow-[0_18px_50px_-18px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-100">
              <AppWindow size={17} /> Add to Chrome
            </button>
          </motion.div>

          <motion.div {...fade(0.2)} className="mt-10 flex justify-center gap-9 lg:justify-start">
            {stats.map(([n, l]) => (
              <div key={l}>
                <p className="text-3xl font-semibold tracking-[-0.03em] text-white">{n}</p>
                <p className="mt-1 text-xs text-neutral-500">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* mockup */}
        <motion.div
          ref={screen}
          initial={{ opacity: 0, y: 50, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.1, delay: 0.1, ease }}
          className="relative"
        >
          <MacBook>
            <Screen shown={shown} />
          </MacBook>

          
        </motion.div>
      </div>
    </section>
  );
}
