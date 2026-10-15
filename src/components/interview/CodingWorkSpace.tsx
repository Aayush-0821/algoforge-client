"use client";

import { useState } from "react";
import type { CodingQuestion, RunResult } from "@/src/lib/interview/types";
import { runCode, submitCode } from "@/src/lib/interview/api";
import { useInterview } from "@/src/lib/interview/store";
import SplitPane from "./SplitPane";
import ProblemPane from "./ProblemPane";
import CodePane from "./CodePane";
import ConsoleDock from "./ConsoleDeck";

// Logic is unchanged. The only edit is `gap-3` on the right column so the
// editor and console float as separate cards.
export default function CodingWorkspace({ question, practice }: { question: CodingQuestion; practice: boolean }) {
  const { state, setCode, setLang, setSubmission } = useInterview();
  const lang = state.lang[question.id] ?? "java";
  const code = state.code[question.id]?.[lang] ?? question.starter[lang];

  const [stdin, setStdin] = useState(question.sampleInput);
  const [running, setRunning] = useState<"run" | "submit" | null>(null);
  const [result, setResult] = useState<RunResult | null>(state.submissions[question.id] ?? null);
  const [tab, setTab] = useState<"testcase" | "result">("testcase");
  const [open, setOpen] = useState(true);

  async function execute(kind: "run" | "submit") {
    setRunning(kind);
    setTab("result");
    setOpen(true);
    try {
      const res = kind === "run" ? await runCode({ questionId: question.id, language: lang, code, stdin }) : await submitCode({ questionId: question.id, language: lang, code });
      setResult(res);
      if (kind === "submit") setSubmission(question.id, res);
    } catch {
      setResult({ status: "runtime_error", cases: [], stderr: "Could not reach the execution service. Try again." });
    } finally {
      setRunning(null);
    }
  }

  return (
    <SplitPane
      left={<ProblemPane question={question} practice={practice} />}
      right={
        <div className="flex h-full flex-col gap-3">
          <div className="min-h-0 flex-1">
            <CodePane
              language={lang}
              code={code}
              onLanguage={(l) => setLang(question.id, l)}
              onCode={(c) => setCode(question.id, lang, c)}
              onReset={() => setCode(question.id, lang, question.starter[lang])}
              onRun={() => execute("run")}
            />
          </div>
          <ConsoleDock
            open={open}
            onToggle={() => setOpen(!open)}
            tab={tab}
            onTab={setTab}
            stdin={stdin}
            onStdin={setStdin}
            result={result}
            running={running}
            onRun={() => execute("run")}
            onSubmit={() => execute("submit")}
          />
        </div>
      }
    />
  );
}