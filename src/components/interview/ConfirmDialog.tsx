"use client";

import type { Question } from "@/src/lib/interview/types";
import { useInterview } from "@/src/lib/interview/store";
import { INK, fMono, fSerif } from "./theme";

export default function ConfirmDialog({ questions, onCancel, onConfirm }: { questions: Question[]; onCancel: () => void; onConfirm: () => void }) {
  const { state } = useInterview();
  const attempted = questions.filter((q) =>
    q.type === "mcq" ? (state.mcq[q.id]?.length ?? 0) > 0 : !!state.submissions[q.id] || Object.keys(state.code[q.id] ?? {}).length > 0,
  ).length;
  const flagged = questions.filter((q) => state.flagged[q.id]).length;

  return (
    <div role="dialog" aria-modal="true" aria-label="Finish assessment" className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-[0_30px_80px_-20px_rgba(15,23,32,0.5)] backdrop-blur-xl" style={{ color: INK }}>
        <h2 className={`text-[36px] leading-none ${fSerif}`}>Finish assessment?</h2>
        <p className="mt-3 text-sm text-slate-600">You cannot return after submitting.</p>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[["Attempted", attempted], ["Unattempted", questions.length - attempted], ["For review", flagged]].map(([l, v]) => (
            <div key={l as string} className="rounded-[20px] bg-sky-100/70 p-4">
              <p className={`text-[34px] leading-none ${fSerif}`}>{v}</p>
              <p className={`mt-2 text-[11px] text-slate-600 ${fMono}`}>{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="h-12 flex-1 rounded-full border border-slate-300 text-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
          >
            Keep working
          </button>
          <button
            onClick={onConfirm}
            className="h-12 flex-1 rounded-full text-sm font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            style={{ backgroundColor: INK }}
          >
            Submit now
          </button>
        </div>
      </div>
    </div>
  );
}