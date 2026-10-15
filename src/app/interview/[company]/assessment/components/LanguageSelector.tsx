"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface Props {
  value?: "java" | "cpp" | "python" | "javascript";
  onChange?: (
    language: "java" | "cpp" | "python" | "javascript"
  ) => void;
}

const languages = [
  {
    id: "java",
    label: "Java",
    icon: "☕",
  },
  {
    id: "cpp",
    label: "C++",
    icon: "⚙️",
  },
  {
    id: "python",
    label: "Python",
    icon: "🐍",
  },
  {
    id: "javascript",
    label: "JavaScript",
    icon: "🟨",
  },
] as const;

export default function LanguageSelector({
  value = "java",
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const current =
    languages.find((l) => l.id === value) ??
    languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          h-10
          items-center
          gap-3
          rounded-xl
          border
          border-zinc-200
          bg-white
          px-4
          text-sm
          transition
          hover:border-orange-500
          dark:border-zinc-700
          dark:bg-zinc-900
        "
      >
        <span className="text-lg">
          {current.icon}
        </span>

        <span>{current.label}</span>

        <ChevronDown
          size={16}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            left-0
            top-12
            z-50
            w-56
            overflow-hidden
            rounded-2xl
            border
            border-zinc-200
            bg-white
            shadow-xl
            dark:border-zinc-700
            dark:bg-zinc-900
          "
        >
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => {
                onChange?.(language.id);
                setOpen(false);
              }}
              className="
                flex
                w-full
                items-center
                justify-between
                px-4
                py-3
                text-left
                transition
                hover:bg-orange-500/10
              "
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {language.icon}
                </span>

                <span>{language.label}</span>
              </div>

              {value === language.id && (
                <Check
                  size={16}
                  className="text-orange-500"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}