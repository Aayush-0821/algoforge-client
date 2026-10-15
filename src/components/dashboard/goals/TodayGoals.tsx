"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowUpRight, Check } from "lucide-react";

import { cn } from "@/lib/utils";

type Difficulty = "Easy" | "Medium" | "Hard";

interface Goal {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  time: string;
  done: boolean;
}

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Solve Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    time: "Morning",
    done: true,
  },
  {
    id: "2",
    title: "Review LRU Cache",
    topic: "Design",
    difficulty: "Hard",
    time: "11:00 AM",
    done: false,
  },
  {
    id: "3",
    title: "Two Graph problems before DP",
    topic: "Graphs",
    difficulty: "Medium",
    time: "Afternoon",
    done: false,
  },
  {
    id: "4",
    title: "Mock interview debrief",
    topic: "Behavioral",
    difficulty: "Medium",
    time: "Evening",
    done: false,
  },
];

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "bg-green-500/10 text-green-500",
  Medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
  Hard: "bg-red-500/10 text-red-500",
};

export default function TodaysGoals() {
  const [goals, setGoals] = useState(initialGoals);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(format(new Date(), "EEEE, d MMM"));
  }, []);

  const toggle = (id: string) =>
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)),
    );

  const completed = goals.filter((g) => g.done).length;

  return (
    <section className="flex h-full flex-col rounded-[2rem] bg-white/50 p-3 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 pb-4 pt-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Today&apos;s Goals
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {today || "Today"} · {completed}/{goals.length} done
          </p>
        </div>

        <button
          aria-label="View all goals"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-zinc-700 shadow-sm transition hover:bg-white dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10"
        >
          <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="flex-1 divide-y divide-black/5 rounded-3xl bg-white px-5 dark:divide-white/5 dark:bg-white/[0.04]">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="flex items-center justify-between gap-4 py-4"
          >
            <div className="min-w-0">
              <h3
                className={cn(
                  "truncate font-medium transition-colors",
                  goal.done
                    ? "text-zinc-400 line-through dark:text-zinc-500"
                    : "text-zinc-900 dark:text-white",
                )}
              >
                {goal.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                  {goal.topic}
                </span>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 font-semibold",
                    difficultyStyles[goal.difficulty],
                  )}
                >
                  {goal.difficulty}
                </span>

                <span className="text-zinc-500">{goal.time}</span>
              </div>
            </div>

            <button
              onClick={() => toggle(goal.id)}
              aria-label={goal.done ? "Mark as not done" : "Mark as done"}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200",
                goal.done
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                  : "border-2 border-zinc-300 text-transparent hover:border-orange-400 dark:border-zinc-600",
              )}
            >
              <Check size={16} strokeWidth={3} />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}