"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock3,
  FileCode2,
} from "lucide-react";

interface Question {
  id: number;
  title: string;
  type: "MCQ" | "Coding";
  solved: boolean;
  current: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    title: "Computer Science Fundamentals",
    type: "MCQ",
    solved: true,
    current: false,
  },
  {
    id: 2,
    title: "Array Manipulation",
    type: "Coding",
    solved: false,
    current: true,
  },
  {
    id: 3,
    title: "Graph Traversal",
    type: "Coding",
    solved: false,
    current: false,
  },
  {
    id: 4,
    title: "Object Oriented Programming",
    type: "MCQ",
    solved: false,
    current: false,
  },
];

export default function QuestionSidebar() {
  return (
    <aside
      className="
        w-72
        border-r
        border-zinc-200
        bg-white
        dark:border-zinc-800
        dark:bg-zinc-900
      "
    >
      <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">
          Questions
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Navigate between questions.
        </p>
      </div>

      <div className="space-y-3 p-4">
        {questions.map((question) => (
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            key={question.id}
            className={`
              flex
              w-full
              items-start
              gap-4
              rounded-2xl
              border
              p-4
              text-left
              transition-all

              ${
                question.current
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                  : "border-zinc-200 hover:border-orange-300 dark:border-zinc-800"
              }
            `}
          >
            <div className="mt-1">
              {question.solved ? (
                <CheckCircle2
                  size={22}
                  className="text-green-500"
                />
              ) : question.current ? (
                <Clock3
                  size={22}
                  className="text-orange-500"
                />
              ) : (
                <Circle
                  size={20}
                  className="text-zinc-400"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FileCode2
                  size={16}
                  className="text-orange-500"
                />

                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {question.type}
                </span>
              </div>

              <h3 className="mt-2 font-semibold">
                Question {question.id}
              </h3>

              <p className="mt-1 text-sm leading-5 text-zinc-500">
                {question.title}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </aside>
  );
}