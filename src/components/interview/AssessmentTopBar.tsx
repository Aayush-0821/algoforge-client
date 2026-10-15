"use client";

import { Clock3, Pause, Play, ShieldCheck } from "lucide-react";
import type { Question } from "@/src/lib/interview/types";
import { useInterview } from "@/src/lib/interview/store";
import { formatClock } from "@/src/lib/interview/useCountdown";
import { INK, LIME, fMono, fSerif, glass } from "./theme";

interface Props {
  companyName: string;
  questions: Question[];
  index: number;
  onSelect: (i: number) => void;
  msLeft: number;
  interview: boolean;
  onFinish: () => void;
}

export default function AssessmentTopBar({ companyName, questions, index, onSelect, msLeft, interview, onFinish }: Props) {
  const { state, pause, resume } = useInterview();
  const paused = state.pausedLeftMs != null;
  const danger = msLeft <= 10 * 60_000;

  const answered = (q: Question) =>
    q.type === "mcq" ? (state.mcq[q.id]?.length ?? 0) > 0 : !!state.submissions[q.id] || Object.keys(state.code[q.id] ?? {}).length > 0;

  return (
    <header className={`flex h-16 shrink-0 items-center justify-between rounded-[26px] px-6 ${glass}`}>
      <div>
        <h1 className={`text-[24px] leading-none ${fSerif}`}>{companyName} online assessment</h1>
        <p className={`mt-1 flex items-center gap-1.5 text-[11px] text-slate-600 ${fMono}`}>
          {interview ? (
            <>
              <ShieldCheck size={12} /> Proctored
            </>
          ) : (
            "Practice mode"
          )}
        </p>
      </div>

      <nav className="flex items-center gap-2" aria-label="Questions">
        {questions.map((q, i) => {
          const cur = i === index;
          const flagged = state.flagged[q.id];
          const cls = cur
            ? "border-transparent text-white"
            : flagged
              ? "border-transparent text-slate-900"
              : answered(q)
                ? "border-emerald-600/40 bg-emerald-400/25 text-emerald-900"
                : "border-white/80 bg-white/50 text-slate-700 hover:bg-white/85";
          return (
            <button
              key={q.id}
              onClick={() => onSelect(i)}
              title={q.title}
              aria-current={cur ? "true" : undefined}
              className={`grid h-9 w-9 place-items-center rounded-full border text-[13px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${fMono} ${cls}`}
              style={cur ? { backgroundColor: INK } : !cur && flagged ? { backgroundColor: LIME } : undefined}
            >
              {i + 1}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <div
          role="timer"
          className={`flex items-center gap-3 rounded-full border px-4 py-2 ${
            danger ? "animate-pulse border-red-500/40 bg-red-500/10 text-red-700" : "border-white/80 bg-white/60"
          }`}
        >
          <Clock3 size={16} />
          <span className={`text-[17px] font-medium tracking-widest ${fMono}`}>{formatClock(msLeft)}</span>
        </div>

        {!interview && (
          <button
            onClick={paused ? resume : pause}
            className="flex h-10 items-center gap-2 rounded-full border border-white/80 bg-white/55 px-4 text-[13px] transition hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
          >
            {paused ? (
              <>
                <Play size={14} /> Resume
              </>
            ) : (
              <>
                <Pause size={14} /> Pause
              </>
            )}
          </button>
        )}

        <button
          onClick={onFinish}
          className="h-10 rounded-full px-5 text-[13px] font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          style={{ backgroundColor: INK }}
        >
          Finish test
        </button>
      </div>
    </header>
  );
}