"use client";

import { Play, Send } from "lucide-react";
import Timer from "./Timer";
import LanguageSelector from "./LanguageSelector";

interface Props {
  company?: string;
  currentQuestion?: number;
  totalQuestions?: number;
}

export default function AssessmentHeader({
  company = "Amazon",
  currentQuestion = 1,
  totalQuestions = 4,
}: Props) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Left */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg font-semibold">
            {company} Interview
          </h1>

          <p className="text-xs text-zinc-500">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>

        <div className="hidden h-8 w-px bg-zinc-200 dark:bg-zinc-700 lg:block" />

        <LanguageSelector />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Timer />

        <button
          className="
            flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-zinc-200
            px-4
            text-sm
            transition
            hover:border-orange-500
            dark:border-zinc-700
          "
        >
          <Play size={16} />
          Run Code
        </button>

        <button
          className="
            flex
            h-10
            items-center
            gap-2
            rounded-xl
            bg-orange-500
            px-5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-orange-600
          "
        >
          <Send size={16} />
          Submit
        </button>
      </div>
    </header>
  );
}