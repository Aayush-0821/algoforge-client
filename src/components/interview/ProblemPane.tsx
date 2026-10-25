
"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import type { CodingQuestion } from "@/src/lib/interview/types";
import { LIME, fMono, fSerif, glassDense } from "./theme";

const diffDot = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
};

function ContentBlock({
  title,
  content,
}: {
  title: string;
  content?: string;
}) {
  if (!content?.trim()) return null;

  return (
    <section className="mt-7">
      <h3 className={`text-[23px] leading-tight ${fSerif}`}>{title}</h3>
      <pre className="mt-3 whitespace-pre-wrap break-words rounded-2xl border border-white/70 bg-white/55 p-4 text-[13px] leading-6 text-slate-700">
        {content}
      </pre>
    </section>
  );
}

export default function ProblemPane({
  question,
  practice,
}: {
  question: CodingQuestion;
  practice: boolean;
}) {
  const [shown, setShown] = useState(0);

  const examples = question.examples ?? [];
  const sampleTestCases = question.sampleTestCases ?? [];
  const constraints = question.constraints ?? [];
  const hints = question.hints ?? [];

  return (
    <section
      className={`h-full overflow-y-auto rounded-[26px] p-6 md:p-8 ${glassDense}`}
    >
      <div className={`flex items-center gap-2 text-[11px] ${fMono}`}>
        <span
          className="rounded-[3px] px-1.5 py-0.5"
          style={{ backgroundColor: LIME }}
        >
          Coding
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-white/70 px-1.5 py-0.5 text-slate-700">
          <span
            className={`h-1.5 w-1.5 rounded-full ${diffDot[question.difficulty]}`}
          />
          {question.difficulty}
        </span>

        <span className="ml-auto text-slate-600">
          {question.marks} marks
        </span>
      </div>

      <h2
        className={`mt-4 break-words text-[32px] leading-tight tracking-[-0.01em] md:text-[38px] ${fSerif}`}
      >
        {question.title}
      </h2>

      <section className="mt-5">
        <h3 className={`text-[23px] leading-tight ${fSerif}`}>
          Problem Statement
        </h3>

        <div className="mt-3 space-y-4 text-[15px] leading-7 text-slate-700">
          {question.description?.length ? (
            question.description.map((paragraph, index) => (
              <p
                key={`${question.id}-statement-${index}`}
                className="whitespace-pre-wrap break-words"
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-slate-500">
              The problem statement is unavailable.
            </p>
          )}
        </div>
      </section>

      <ContentBlock
        title="Input Format"
        content={question.inputFormat}
      />

      <ContentBlock
        title="Output Format"
        content={question.outputFormat}
      />

      <section className="mt-9">
        <h3 className={`text-[26px] leading-none ${fSerif}`}>
          Examples
        </h3>

        {examples.length ? (
          <div className="mt-4 space-y-4">
            {examples.map((example, index) => (
              <div
                key={`${question.id}-example-${index}`}
                className="rounded-[22px] border border-white/80 bg-white/55 p-5 text-[13px]"
              >
                <p className="font-semibold">Example {index + 1}</p>

                <div className={fMono}>
                  <p className="mt-3 text-slate-500">Input</p>
                  <pre className="mt-1 whitespace-pre-wrap break-words rounded-xl bg-white/80 p-3 text-slate-900">
                    {example.input || "—"}
                  </pre>

                  <p className="mt-3 text-slate-500">Output</p>
                  <pre className="mt-1 whitespace-pre-wrap break-words rounded-xl bg-white/80 p-3 text-slate-900">
                    {example.output || "—"}
                  </pre>
                </div>

                {example.explanation && (
                  <div className="mt-3">
                    <p className="text-slate-500">Explanation</p>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {example.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No illustrative examples are available for this question.
          </p>
        )}
      </section>

      <section className="mt-9">
        <h3 className={`text-[26px] leading-none ${fSerif}`}>
          Constraints
        </h3>

        {constraints.length ? (
          <ul className="mt-4 space-y-2">
            {constraints.map((constraint, index) => (
              <li
                key={`${question.id}-constraint-${index}`}
                className={`whitespace-pre-wrap break-words rounded-xl bg-white/60 px-4 py-2.5 text-[13px] ${fMono}`}
              >
                {constraint}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No constraints provided.
          </p>
        )}
      </section>

      {sampleTestCases.length > 0 && (
        <section className="mt-9">
          <h3 className={`text-[26px] leading-none ${fSerif}`}>
            Sample Test Cases
          </h3>

          <div className="mt-4 space-y-4">
            {sampleTestCases.map((testCase, index) => (
              <div
                key={`${question.id}-sample-${index}`}
                className="rounded-[22px] border border-white/80 bg-white/55 p-5 text-[13px]"
              >
                <p className="font-semibold">
                  Sample Case {index + 1}
                </p>

                <div className={fMono}>
                  <p className="mt-3 text-slate-500">Input</p>
                  <pre className="mt-1 whitespace-pre-wrap break-words rounded-xl bg-white/80 p-3 text-slate-900">
                    {testCase.input || "—"}
                  </pre>

                  <p className="mt-3 text-slate-500">Expected Output</p>
                  <pre className="mt-1 whitespace-pre-wrap break-words rounded-xl bg-white/80 p-3 text-slate-900">
                    {testCase.output || "—"}
                  </pre>
                </div>

                {testCase.explanation && (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {testCase.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {practice && (
        <section
          className="mt-9 rounded-[22px] border p-5"
          style={{
            backgroundColor: "rgba(227,247,138,0.45)",
            borderColor: "rgba(160,190,40,0.45)",
          }}
        >
          <div className={`flex items-center gap-2 text-[24px] leading-none ${fSerif}`}>
            <Lightbulb size={18} />
            Hints
          </div>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
            {hints.slice(0, shown).map((hint, index) => (
              <li key={`${question.id}-hint-${index}`}>
                {index + 1}. {hint}
              </li>
            ))}
          </ul>

          {shown < hints.length && (
            <button
              onClick={() => setShown((current) => current + 1)}
              className="mt-3 text-sm font-medium underline underline-offset-4 hover:no-underline"
            >
              {shown === 0 ? "Reveal a hint" : "Reveal next hint"}
            </button>
          )}
        </section>
      )}
    </section>
  );
}
