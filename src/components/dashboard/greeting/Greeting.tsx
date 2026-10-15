"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";

import { subtitles } from "./greetings";

interface GreetingProps {
  name: string;
  problemsSolved?: number;
  streak?: number;
  ctaHref?: string;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>

      <div className="mt-1 flex items-start gap-1">
        <span className="text-5xl font-semibold leading-none tracking-tight text-zinc-900 dark:text-white">
          {value}
        </span>

        <ArrowUpRight
          size={16}
          className="mt-1 text-zinc-500 dark:text-zinc-400"
        />
      </div>
    </div>
  );
}

export default function Greeting({
  name,
  problemsSolved = 187,
  streak = 18,
  ctaHref = "/dashboard",
}: GreetingProps) {
  const [subtitle, setSubtitle] = useState(subtitles[0]);

  const hour = new Date().getHours();

  let greeting = "Welcome Back";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 23) {
    greeting = "Good Evening";
  } else {
    greeting = "Still Grinding?";
  }

  useEffect(() => {
    setSubtitle(
      subtitles[Math.floor(Math.random() * subtitles.length)]
    );
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 px-2 pt-2"
    >
      {/* Left: greeting */}
      <div className="min-w-0">
        <h1 className="text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          {greeting}, <span className="text-orange-500">{name}</span>!
        </h1>

        <p className="mt-3 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>

      {/* Right: stats + CTA */}
      <div className="flex items-end gap-10">
        <Stat label="Problems solved" value={problemsSolved} />
        <Stat label="Day streak" value={streak} />

        <Link
          href={ctaHref}
          className="flex h-14 items-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:bg-zinc-800 dark:bg-orange-500 dark:shadow-orange-500/20 dark:hover:bg-orange-600"
        >
          <Plus size={16} />
          Start Practice
        </Link>
      </div>
    </motion.section>
  );
}