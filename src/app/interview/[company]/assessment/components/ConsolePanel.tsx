"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Play,
  Terminal,
  FileText,
  AlertCircle,
} from "lucide-react";

const tabs = [
  {
    id: "testcase",
    label: "Test Cases",
    icon: FileText,
  },
  {
    id: "output",
    label: "Output",
    icon: Terminal,
  },
  {
    id: "console",
    label: "Console",
    icon: AlertCircle,
  },
];

export default function ConsolePanel() {
  const [activeTab, setActiveTab] =
    useState("testcase");

  return (
    <div className="h-72 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">

      {/* Tabs */}

      <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id)
              }
              className={`
                flex
                items-center
                gap-2
                border-b-2
                px-5
                py-3
                text-sm
                transition

                ${
                  activeTab === tab.id
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-zinc-500 hover:text-white"
                }
              `}
            >
              <Icon size={16} />

              {tab.label}
            </button>
          );
        })}

      </div>

      {/* Content */}

      <div className="h-[calc(100%-52px)] overflow-auto p-5">

        {activeTab === "testcase" && (
          <div className="space-y-5">

            <div>

              <label className="mb-2 block text-sm font-medium">
                Input
              </label>

              <textarea
                defaultValue={`1 5 4 2 9 9 9
3`}
                className="
                  h-28
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  bg-background
                  p-4
                  font-mono
                  text-sm
                  outline-none
                  dark:border-zinc-800
                "
              />

            </div>

            <button
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-orange-500
                px-5
                py-3
                text-white
                transition
                hover:bg-orange-600
              "
            >
              <Play size={17} />

              Run Code

            </button>

          </div>
        )}

        {activeTab === "output" && (

          <div
            className="
              rounded-xl
              border
              border-zinc-200
              bg-background
              p-5
              font-mono
              text-sm
              dark:border-zinc-800
            "
          >
            <div className="flex items-center gap-2 text-green-500">

              <CheckCircle2 size={16} />

              Execution Successful

            </div>

            <pre className="mt-4 whitespace-pre-wrap">
{`Output

15`}
            </pre>

          </div>

        )}

        {activeTab === "console" && (

          <div
            className="
              rounded-xl
              border
              border-zinc-200
              bg-background
              p-5
              font-mono
              text-sm
              dark:border-zinc-800
            "
          >
{`[INFO]

Compiling Java...

Compilation Successful.

Waiting for execution...
`}
          </div>

        )}

      </div>

    </div>
  );
}