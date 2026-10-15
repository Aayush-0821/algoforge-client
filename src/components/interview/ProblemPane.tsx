"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import type { CodingQuestion } from "@/src/lib/interview/types";
import { LIME, fMono, fSerif, glassDense } from "./theme";

const diffDot = { Easy: "bg-emerald-500", Medium: "bg-amber-500", Hard: "bg-red-500" };

export default function ProblemPane({ question, practice }: { question: CodingQuestion; practice: boolean }) {
  const [shown, setShown] = useState(0);

  return (
    <section className={`h-full overflow-y-auto rounded-[26px] p-8 ${glassDense}`}>
      <div className={`flex items-center gap-2 text-[11px] ${fMono}`}>
        <span className="rounded-[3px] px-1.5 py-0.5" style={{ backgroundColor: LIME }}>
          Coding
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-white/70 px-1.5 py-0.5 text-slate-700">
          <span className={`h-1.5 w-1.5 rounded-full ${diffDot[question.difficulty]}`} />
          {question.difficulty}
        </span>
        <span className="ml-auto text-slate-600">{question.marks} marks</span>
      </div>

      <h2 className={`mt-4 text-[38px] leading-[1.05] tracking-[-0.01em] ${fSerif}`}>{question.title}</h2>
      <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-700">
        {question.description.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h3 className={`mt-9 text-[26px] leading-none ${fSerif}`}>Examples</h3>
      <div className="mt-4 space-y-4">
        {question.examples.map((ex, i) => (
          <div key={i} className="rounded-[22px] border border-white/80 bg-white/55 p-5 text-[13px]">
            <p className="font-semibold">Example {i + 1}</p>
            <div className={fMono}>
              <p className="mt-3 text-slate-500">Input</p>
              <pre className="mt-1 whitespace-pre-wrap rounded-xl bg-white/80 p-3 text-slate-900">{ex.input}</pre>
              <p className="mt-3 text-slate-500">Output</p>
              <pre className="mt-1 rounded-xl bg-white/80 p-3 text-slate-900">{ex.output}</pre>
            </div>
            {ex.explanation && <p className="mt-3 text-sm leading-6 text-slate-700">{ex.explanation}</p>}
          </div>
        ))}
      </div>

      <h3 className={`mt-9 text-[26px] leading-none ${fSerif}`}>Constraints</h3>
      <ul className="mt-4 space-y-2">
        {question.constraints.map((c) => (
          <li key={c} className={`rounded-xl bg-white/60 px-4 py-2.5 text-[13px] ${fMono}`}>
            {c}
          </li>
        ))}
      </ul>

      {practice && (
        <div
          className="mt-9 rounded-[22px] border p-5"
          style={{ backgroundColor: "rgba(227,247,138,0.45)", borderColor: "rgba(160,190,40,0.45)" }}
        >
          <div className={`flex items-center gap-2 text-[24px] leading-none ${fSerif}`}>
            <Lightbulb size={18} /> Hints
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
            {question.hints.slice(0, shown).map((h, i) => (
              <li key={i}>
                {i + 1}. {h}
              </li>
            ))}
          </ul>
          {shown < question.hints.length && (
            <button onClick={() => setShown(shown + 1)} className="mt-3 text-sm font-medium underline underline-offset-4 hover:no-underline">
              {shown === 0 ? "Reveal a hint" : "Reveal next hint"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}