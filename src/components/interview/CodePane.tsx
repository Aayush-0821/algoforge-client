"use client";

import { useRef, useState } from "react";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { Copy, Minus, Plus, RotateCcw } from "lucide-react";
import type { Language } from "@/src/lib/interview/types";
import { fMono, glass } from "./theme";

const languages: { id: Language; label: string }[] = [
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
];

interface Props {
  language: Language;
  code: string;
  onLanguage: (l: Language) => void;
  onCode: (c: string) => void;
  onReset: () => void;
  onRun: () => void;
}

// Editor stays dark for readability; ink background + lime accents tie it to the sky UI.
const beforeMount: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("forge", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0f1720",
      "editor.lineHighlightBackground": "#17212d",
      "editorLineNumber.foreground": "#4b5a6b",
      "editorLineNumber.activeForeground": "#e3f78a",
      "editorCursor.foreground": "#e3f78a",
    },
  });
};

export default function CodePane({ language, code, onLanguage, onCode, onReset, onRun }: Props) {
  const [size, setSize] = useState(15);
  const runRef = useRef(onRun);
  runRef.current = onRun;

  const onMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
  };

  const btn =
    "flex h-9 items-center gap-2 rounded-full border border-white/80 bg-white/55 px-3.5 text-xs transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900";

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-[26px] ${glass}`}>
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/70 px-4">
        <select
          value={language}
          onChange={(e) => onLanguage(e.target.value as Language)}
          aria-label="Language"
          className="h-9 rounded-full border border-white/80 bg-white/55 px-4 text-sm outline-none transition focus:bg-white/90"
        >
          {languages.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button className={btn} onClick={() => setSize((s) => Math.max(11, s - 1))} title="Smaller font" aria-label="Smaller font">
            <Minus size={13} />
          </button>
          <span className={`w-6 text-center text-xs text-slate-600 ${fMono}`}>{size}</span>
          <button className={btn} onClick={() => setSize((s) => Math.min(22, s + 1))} title="Larger font" aria-label="Larger font">
            <Plus size={13} />
          </button>
          <button className={btn} onClick={() => navigator.clipboard.writeText(code)}>
            <Copy size={13} /> Copy
          </button>
          <button className={btn} onClick={onReset}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 bg-[#0f1720]">
        <Editor
          language={language}
          path={`solution.${language}`}
          theme="forge"
          value={code}
          beforeMount={beforeMount}
          onMount={onMount}
          onChange={(v) => onCode(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: size,
            fontLigatures: true,
            smoothScrolling: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            cursorBlinking: "smooth",
            tabSize: 4,
            renderLineHighlight: "all",
          }}
        />
      </div>
    </div>
  );
}