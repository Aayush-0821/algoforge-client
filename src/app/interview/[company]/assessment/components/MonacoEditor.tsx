"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Copy,
  Maximize2,
  RotateCcw,
  Settings2,
} from "lucide-react";

const templates = {
  java: `import java.util.*;

public class Solution {

    public static void main(String[] args) {

    }

}
`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}
`,

  python: `def solve():

    pass


if __name__ == "__main__":
    solve()
`,

  javascript: `function solve() {

}

solve();
`,
};

export default function MonacoEditor() {
  const [language, setLanguage] = useState<
    "java" | "cpp" | "python" | "javascript"
  >("java");

  const [code, setCode] = useState(
    templates.java
  );

  function changeLanguage(
    lang: typeof language
  ) {
    setLanguage(lang);
    setCode(templates[lang]);
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">

      {/* Toolbar */}

      <div
        className="
          flex
          h-14
          items-center
          justify-between
          border-b
          border-zinc-200
          bg-white
          px-5
          dark:border-zinc-800
          dark:bg-zinc-900
        "
      >
        <div className="flex items-center gap-4">

          <select
            value={language}
            onChange={(e) =>
              changeLanguage(
                e.target.value as typeof language
              )
            }
            className="
              rounded-xl
              border
              border-zinc-200
              bg-transparent
              px-3
              py-2
              text-sm
              outline-none
              dark:border-zinc-700
            "
          >
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="python">
              Python
            </option>
            <option value="javascript">
              JavaScript
            </option>
          </select>

        </div>

        <div className="flex items-center gap-2">

          <ToolbarButton
            icon={<RotateCcw size={16} />}
            text="Reset"
            onClick={() =>
              setCode(
                templates[language]
              )
            }
          />

          <ToolbarButton
            icon={<Copy size={16} />}
            text="Copy"
            onClick={() =>
              navigator.clipboard.writeText(code)
            }
          />

          <ToolbarButton
            icon={<Settings2 size={16} />}
            text="Settings"
          />

          <ToolbarButton
            icon={<Maximize2 size={16} />}
            text="Fullscreen"
          />

        </div>
      </div>

      {/* Monaco */}

      <div className="flex-1">
        <Editor
          language={language === "cpp" ? "cpp" : language}
          theme="vs-dark"
          value={code}
          onChange={(value) =>
            setCode(value ?? "")
          }
          options={{
            minimap: {
              enabled: false,
            },

            fontSize: 15,

            smoothScrolling: true,

            scrollBeyondLastLine: false,

            automaticLayout: true,

            wordWrap: "on",

            padding: {
              top: 20,
            },

            roundedSelection: true,

            cursorBlinking: "smooth",

            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex
        items-center
        gap-2
        rounded-xl
        border
        border-zinc-200
        px-3
        py-2
        text-sm
        transition
        hover:border-orange-500
        dark:border-zinc-700
      "
    >
      {icon}

      {text}
    </button>
  );
}