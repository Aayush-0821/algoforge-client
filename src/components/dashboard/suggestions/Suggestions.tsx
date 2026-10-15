"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";

const START = 8;
const END = 17;
const HOURS = Array.from({ length: END - START + 1 }, (_, i) => START + i);

const pct = (t: number) => ((t - START) / (END - START)) * 100;
const label = (h: number) => `${String(h).padStart(2, "0")}:00`;

const tones = {
  orange: {
    fill: "bg-orange-400/90 dark:bg-orange-500/80",
    rest: "bg-orange-200/60 dark:bg-orange-500/15",
    text: "text-zinc-900 dark:text-white",
  },
  neutral: {
    fill: "bg-zinc-300 dark:bg-zinc-600/70",
    rest: "bg-zinc-200/60 dark:bg-white/5",
    text: "text-zinc-900 dark:text-white",
  },
  lilac: {
    fill: "bg-violet-300 dark:bg-violet-500/50",
    rest: "bg-violet-100 dark:bg-violet-500/10",
    text: "text-zinc-900 dark:text-white",
  },
} as const;

const plan = [
  {
    title: "Daily Challenge",
    subtitle: "Arrays · Medium",
    start: 9,
    end: 11,
    progress: 1,
    tone: "orange",
  },
  {
    title: "Roadmap Milestone",
    subtitle: "Dynamic Programming",
    start: 11,
    end: 13.5,
    progress: 0.45,
    tone: "neutral",
  },
  {
    title: "Mock Interview",
    subtitle: "System Design · 45 min",
    start: 14,
    end: 16.5,
    progress: 0,
    tone: "lilac",
  },
] as const;

export default function Suggestions() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.getHours() + d.getMinutes() / 60);
    };

    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const showNow = now !== null && now >= START && now <= END;

  return (
    <section className="rounded-[2rem] bg-white/50 p-3 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 pb-4 pt-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Today&apos;s Plan
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            What&apos;s waiting for you today
          </p>
        </div>

        <button
          aria-label="Calendar"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-zinc-700 shadow-sm transition hover:bg-white dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10"
        >
          <CalendarDays size={18} />
        </button>
      </div>

      <div className="rounded-3xl bg-white px-10 pb-6 pt-5 dark:bg-white/[0.04]">
        {/* Hour labels */}
        <div className="relative h-5">
          {HOURS.map((h) => (
            <span
              key={h}
              className={cn(
                "absolute -translate-x-1/2 text-xs",
                showNow && Math.abs((now as number) - h) < 0.5
                  ? "font-semibold text-zinc-900 dark:text-white"
                  : "text-zinc-400",
              )}
              style={{ left: `${pct(h)}%` }}
            >
              {label(h)}
            </span>
          ))}
        </div>

        {/* Timeline body */}
        <div className="relative mt-3 h-[230px]">
          {/* Grid lines */}
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute bottom-0 top-0 border-l border-dashed border-black/10 dark:border-white/10"
              style={{ left: `${pct(h)}%` }}
            />
          ))}

          {/* Bars */}
          {plan.map((item, i) => {
            const tone = tones[item.tone];

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className={cn(
                  "absolute h-16 overflow-hidden rounded-2xl",
                  tone.rest,
                )}
                style={{
                  top: `${i * 76}px`,
                  left: `${pct(item.start)}%`,
                  width: `${pct(item.end) - pct(item.start)}%`,
                }}
              >
                <div
                  className={cn("absolute inset-y-0 left-0", tone.fill)}
                  style={{ width: `${item.progress * 100}%` }}
                />

                <div
                  className={cn(
                    "relative flex h-full flex-col justify-center px-4",
                    tone.text,
                  )}
                >
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs opacity-60">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Now marker */}
          {showNow && (
            <div
              className="absolute -top-1 bottom-0 z-10 w-px bg-orange-500"
              style={{ left: `${pct(now as number)}%` }}
            >
              <span className="absolute -left-[3px] top-0 h-[7px] w-[7px] rounded-full bg-orange-500" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}