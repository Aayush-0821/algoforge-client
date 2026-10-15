"use client";

import Link from "next/link";
import { use } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock3,
  Globe,
  Keyboard,
  Laptop,
  Monitor,
  ShieldCheck,
} from "lucide-react";
import {
  INK,
  LIME,
  fMono,
  fSerif,
  fontVars,
  glass,
  skyB,
  skyHero,
} from "@/src/components/interview/theme";

interface Props {
  params: Promise<{ company: string }>;
  searchParams: Promise<{ mode?: string }>;
}

const checks = [
  { icon: Laptop, title: "Browser", status: "Supported" },
  { icon: Globe, title: "Internet", status: "Connected" },
  { icon: Keyboard, title: "Keyboard", status: "Detected" },
  { icon: Monitor, title: "Display", status: "1920 × 1080" },
];

export default function InstructionsPage({ params, searchParams }: Props) {
  const { company: slug } = use(params);
  const { mode = "practice" } = use(searchParams);

  const company = slug.charAt(0).toUpperCase() + slug.slice(1);

  const rules =
    mode === "practice"
      ? [
          "Unlimited Run Code",
          "Hints available",
          "Pause timer",
          "View solutions after submission",
          "Unlimited attempts",
        ]
      : [
          "No tab switching",
          "No hints",
          "Fullscreen required",
          "One submission only",
          "Hidden testcases",
          "Timer cannot pause",
        ];

  return (
    <div
      className={`${fontVars} min-h-screen bg-white px-3 py-3 sm:px-6 sm:py-6`}
      style={{ color: INK }}
    >
      {/* hero panel */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[28px] px-5 py-10 sm:px-8 md:rounded-[44px] md:px-12 md:py-14"
        style={skyHero}
      >
        <div className="mx-auto max-w-6xl">
          <h1
            className={`text-[48px] leading-[1] tracking-[-0.015em] md:text-[80px] ${fSerif}`}
          >
            {company} <em>interview</em>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-800">
            Please verify your system before starting the assessment.
          </p>

          <div className={`mt-10 grid grid-cols-2 rounded-[28px] md:grid-cols-4 ${glass}`}>
            {checks.map(({ icon: Icon, title, status }, i) => (
              <div
                key={title}
                className={`p-5 md:p-6 ${i % 2 === 1 ? "border-l border-white/70" : ""} ${
                  i > 1 ? "border-t border-white/70 md:border-t-0" : ""
                } ${i > 0 ? "md:border-l md:border-white/70" : ""}`}
              >
                <Icon size={18} className="text-slate-700" />
                <p className={`mt-4 text-[26px] leading-none ${fSerif}`}>{title}</p>
                <p className={`mt-2 inline-flex items-center gap-1.5 text-xs text-slate-700 ${fMono}`}>
                  <Check size={13} strokeWidth={3} className="text-emerald-600" />
                  {status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* rules + summary panel */}
      <section
        className="mt-4 overflow-hidden rounded-[28px] px-5 py-10 sm:px-8 md:rounded-[44px] md:px-12 md:py-14"
        style={skyB}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`rounded-[30px] p-7 md:p-8 ${glass}`}>
              <h2 className={`flex items-center gap-3 text-[32px] leading-none ${fSerif}`}>
                <ShieldCheck size={22} className="text-slate-700" />
                Rules
              </h2>
              <ul className="mt-7 space-y-3.5">
                {rules.map((rule) => (
                  <li key={rule} className="flex items-center gap-3 text-[14px]">
                    <Check size={17} strokeWidth={2.4} className="shrink-0 text-slate-800" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-[30px] p-7 md:p-8 ${glass}`}>
              <h2 className={`flex items-center gap-3 text-[32px] leading-none ${fSerif}`}>
                <Clock3 size={22} className="text-slate-700" />
                Assessment summary
              </h2>
              <div className="mt-7">
                <SummaryRow label="Duration" value="100 Minutes" />
                <SummaryRow label="Coding Questions" value="2" />
                <SummaryRow label="MCQs" value="2" />
                <SummaryRow label="Languages" value="Java | C++ | Python | JS" />
                <SummaryRow
                  label="Mode"
                  value={mode === "practice" ? "Practice" : "Interview"}
                  highlight
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href={`/dashboard/interview/${slug}/assessment?mode=${mode}`}
              className="flex h-14 items-center gap-2 rounded-full px-8 text-[15px] font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              style={{ backgroundColor: INK }}
            >
              Start assessment
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/70 py-4 last:border-b-0">
      <span className="text-[13px] text-slate-700">{label}</span>
      <span
        className={`rounded-[3px] px-1.5 py-0.5 text-[13px] ${fMono}`}
        style={highlight ? { backgroundColor: LIME } : undefined}
      >
        {value}
      </span>
    </div>
  );
}