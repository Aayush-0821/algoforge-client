"use client";

// File name matches your CodingWorkspace import (./ConsoleDeck); the component is ConsoleDock.
import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Loader2, Play, Send, X } from "lucide-react";
import type { RunResult } from "@/src/lib/interview/types";
import { INK, LIME, fMono, glassDense } from "./theme";

interface Props {
  open: boolean;
  onToggle: () => void;
  tab: "testcase" | "result";
  onTab: (t: "testcase" | "result") => void;
  stdin: string;
  onStdin: (s: string) => void;
  result: RunResult | null;
  running: "run" | "submit" | null;
  onRun: () => void;
  onSubmit: () => void;
}

const label: Record<RunResult["status"], string> = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  runtime_error: "Runtime Error",
  compile_error: "Compilation Error",
  tle: "Time Limit Exceeded",
};

export default function ConsoleDock({ open, onToggle, tab, onTab, stdin, onStdin, result, running, onRun, onSubmit }: Props) {
  const [sel, setSel] = useState(0);
  const tabCls = (t: string) =>
    `border-b-2 px-4 py-3.5 text-[13px] transition focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-900 ${
      tab === t ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-900"
    }`;
  const c = result?.cases[sel];
  const ok = result?.status === "accepted";

  return (
    <div className={`shrink-0 overflow-hidden rounded-[26px] transition-[height] ${glassDense} ${open ? "h-72" : "h-[50px]"}`}>
      <div className="flex h-[50px] items-center justify-between border-b border-white/70 pr-3">
        <div role="tablist" className="flex">
          <button role="tab" aria-selected={tab === "testcase"} className={tabCls("testcase")} onClick={() => { onTab("testcase"); if (!open) onToggle(); }}>
            Test case
          </button>
          <button role="tab" aria-selected={tab === "result"} className={tabCls("result")} onClick={() => { onTab("result"); if (!open) onToggle(); }}>
            Result
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={!!running}
            className="flex h-9 items-center gap-2 rounded-full border border-white/80 bg-white/60 px-4 text-[13px] transition hover:bg-white/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 disabled:opacity-50"
          >
            {running === "run" ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Run
            <kbd className={`ml-1 text-[10px] text-slate-500 ${fMono}`}>Ctrl+↵</kbd>
          </button>
          <button
            onClick={onSubmit}
            disabled={!!running}
            className="flex h-9 items-center gap-2 rounded-full px-5 text-[13px] font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
            style={{ backgroundColor: INK }}
          >
            {running === "submit" ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Submit
          </button>
          <button
            onClick={onToggle}
            aria-label={open ? "Collapse console" : "Expand console"}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-white/70 hover:text-slate-900"
          >
            {open ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="h-[calc(100%-50px)] overflow-auto p-5">
          {tab === "testcase" && (
            <>
              <label htmlFor="custom-input" className={`mb-2 block text-[11px] text-slate-600 ${fMono}`}>
                Custom input
              </label>
              <textarea
                id="custom-input"
                value={stdin}
                onChange={(e) => onStdin(e.target.value)}
                spellCheck={false}
                className={`h-32 w-full resize-none rounded-2xl border border-white/80 bg-white/70 p-4 text-[13px] outline-none transition focus:border-slate-900 ${fMono}`}
              />
            </>
          )}

          {tab === "result" && !result && !running && <p className="text-sm text-slate-600">Run your code to see results here.</p>}
          {tab === "result" && running && (
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <Loader2 size={16} className="animate-spin" /> {running === "run" ? "Running" : "Evaluating"} your code…
            </p>
          )}

          {tab === "result" && result && !running && (
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-[4px] px-2.5 py-1.5 text-[14px] font-medium ${fMono} ${ok ? "text-slate-900" : "bg-red-500/15 text-red-700"}`}
                style={ok ? { backgroundColor: LIME } : undefined}
              >
                {ok ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />} {label[result.status]}
              </div>

              {result.stderr && (
                <pre className={`mt-4 whitespace-pre-wrap rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-xs text-red-800 ${fMono}`}>{result.stderr}</pre>
              )}

              {result.cases.length > 0 && (
                <>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.cases.map((cs, i) => (
                      <button
                        key={i}
                        onClick={() => setSel(i)}
                        className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs transition ${
                          sel === i ? "border-slate-900 bg-white/90" : "border-white/80 bg-white/45 text-slate-600 hover:bg-white/80"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${cs.passed ? "bg-emerald-500" : "bg-red-500"}`} /> Case {i + 1}
                      </button>
                    ))}
                  </div>
                  {c && (
                    <div className={`mt-4 space-y-3 text-xs ${fMono}`}>
                      {[["Input", c.input], ["Expected", c.expected], ["Output", c.output]].map(([k, v]) => (
                        <div key={k}>
                          <p className="mb-1 text-slate-500">{k}</p>
                          <pre className="whitespace-pre-wrap rounded-xl bg-white/80 p-3 text-slate-900">{v}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}