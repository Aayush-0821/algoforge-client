"use client";

import { Check } from "lucide-react";
import type { McqQuestion } from "@/src/lib/interview/types";
import { useInterview } from "@/src/lib/interview/store";
import { INK, LIME, fMono, fSerif, glassDense } from "./theme";

export default function McqPane({ question, number }: { question: McqQuestion; number: number }) {
  const { state, setMcq } = useInterview();
  const selected = state.mcq[question.id] ?? [];

  const pick = (i: number) => {
    if (question.multiple) setMcq(question.id, selected.includes(i) ? selected.filter((x) => x !== i) : [...selected, i]);
    else setMcq(question.id, [i]);
  };

  return (
    <div className={`h-full overflow-y-auto rounded-[26px] ${glassDense}`}>
      <div className="mx-auto max-w-3xl px-8 py-12">
        <div className={`flex items-center gap-3 text-[11px] ${fMono}`}>
          <span className="rounded-[3px] px-1.5 py-0.5" style={{ backgroundColor: LIME }}>
            MCQ
          </span>
          <span className="text-slate-600">
            {question.marks} marks | {question.multiple ? "Select all that apply" : "Select one"}
          </span>
        </div>

        <h2 className={`mt-5 text-xs text-slate-500 ${fMono}`}>
          Question {number} | {question.title}
        </h2>
        <p className={`mt-3 text-[34px] leading-[1.15] tracking-[-0.01em] ${fSerif}`}>{question.prompt}</p>

        {question.code && (
          <pre className={`mt-6 overflow-x-auto rounded-2xl bg-[#0f1720] p-5 text-sm leading-6 text-slate-100 ${fMono}`}>{question.code}</pre>
        )}

        <div className="mt-8 space-y-3" role={question.multiple ? "group" : "radiogroup"}>
          {question.options.map((opt, i) => {
            const on = selected.includes(i);
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                role={question.multiple ? "checkbox" : "radio"}
                aria-checked={on}
                className={`flex w-full items-center gap-4 rounded-[22px] border p-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                  on ? "border-slate-900 bg-white/90" : "border-white/80 bg-white/45 hover:bg-white/75"
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center border ${question.multiple ? "rounded-md" : "rounded-full"} ${
                    on ? "border-slate-900 text-slate-900" : "border-slate-400"
                  }`}
                  style={on ? { backgroundColor: LIME } : undefined}
                >
                  {on && <Check size={13} strokeWidth={3.5} />}
                </span>
                <span className={`text-xs text-slate-500 ${fMono}`}>{String.fromCharCode(65 + i)}</span>
                <span className="text-[15px]">{opt}</span>
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <button onClick={() => setMcq(question.id, [])} className="mt-5 text-sm text-slate-600 underline underline-offset-4 transition hover:text-slate-900">
            Clear selection
          </button>
        )}
      </div>
    </div>
  );
}