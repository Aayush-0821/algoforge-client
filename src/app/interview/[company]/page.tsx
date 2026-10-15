"use client";

import Link from "next/link";
import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  FileText,
  Gauge,
  ListChecks,
  Trophy,
} from "lucide-react";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

import {
  generalInstructions,
  getCompany,
  modeRules,
} from "@/src/lib/interview/data";
import { useInterview } from "@/src/lib/interview/store";
import type { Mode } from "@/src/lib/interview/types";
import CompanyMark from "@/src/components/interview/CompanyMark";

/* ------------------------------------------------------------------ */
/* Design tokens (same as the interview home page)                     */
/* ------------------------------------------------------------------ */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-ui",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-ui",
});

const fMono = "[font-family:var(--font-mono-ui),ui-monospace,monospace]";
const fSerif = "[font-family:var(--font-serif-ui),Georgia,serif]";

const INK = "#0f1720";
const LIME = "#e3f78a";

const skyHero = {
  background: `
    radial-gradient(ellipse 50% 32% at 8% 6%, rgba(255,255,255,0.7), transparent 70%),
    radial-gradient(ellipse 55% 38% at 92% 30%, rgba(255,255,255,0.6), transparent 70%),
    radial-gradient(ellipse 80% 30% at 50% 100%, rgba(255,255,255,0.95), transparent 70%),
    linear-gradient(180deg, #4f97d8 0%, #86b5e0 45%, #d3e4f3 100%)
  `,
};
const skyB = {
  background: `
    radial-gradient(ellipse 50% 40% at 85% 85%, rgba(255,255,255,0.8), transparent 70%),
    radial-gradient(ellipse 45% 35% at 10% 70%, rgba(255,255,255,0.55), transparent 70%),
    radial-gradient(ellipse 60% 30% at 60% 0%, rgba(255,255,255,0.5), transparent 70%),
    linear-gradient(200deg, #6aa9e0 0%, #a3c7e8 45%, #dce9f5 100%)
  `,
};

const glass =
  "border border-white/70 bg-white/45 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_24px_60px_-28px_rgba(30,70,120,0.4)]";

function Ticks({ level }: { level: number }) {
  const TOTAL = 20;
  const filled = Math.round(level * TOTAL);
  return (
    <div className="flex h-4 items-stretch gap-[3px]" aria-hidden="true">
      {Array.from({ length: TOTAL }).map((_, i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full ${
            i < filled ? "bg-[#8ccf00]" : "bg-slate-500/25"
          }`}
        />
      ))}
    </div>
  );
}

export default function CompanyOverviewPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company: slug } = use(params);
  const company = getCompany(slug);
  const router = useRouter();
  const { setup } = useInterview();
  const [mode, setMode] = useState<Mode>("practice");
  const [agreed, setAgreed] = useState(false);

  if (!company) notFound();

  const totalMarks = company.sections.reduce((a, s) => a + s.marks, 0);
  const totalQs = company.sections.reduce((a, s) => a + s.count, 0);

  const d = company.difficulty.toLowerCase();
  const level = d === "hard" ? 0.92 : d === "easy" ? 0.3 : 0.62;
  const dot =
    d === "hard" ? "bg-red-500" : d === "easy" ? "bg-emerald-500" : "bg-amber-500";

  const proceed = () => {
    setup(slug, mode);
    router.push(`/interview/${slug}/system-check`);
  };

  const stats = [
    { Icon: Clock3, label: "Duration", value: `${company.durationMins} min` },
    { Icon: ListChecks, label: "Questions", value: `${totalQs}` },
    { Icon: Trophy, label: "Total marks", value: `${totalMarks}` },
  ];

  return (
    <div
      className={`${mono.variable} ${serif.variable} min-h-screen bg-white px-3 py-3 sm:px-6 sm:py-6`}
      style={{ color: INK }}
    >
      {/* ================= Hero panel ================= */}
      <section
        className="relative overflow-hidden rounded-[28px] px-5 py-8 sm:px-8 md:rounded-[44px] md:px-12 md:py-10"
        style={skyHero}
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br ${company.gradient} opacity-25 blur-3xl`}
        />

        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/interview"
            className={`group inline-flex items-center gap-2 text-xs text-slate-800 transition-colors hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 ${fMono}`}
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            All companies
          </Link>

          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-[26px] border border-white/70 bg-white/70 shadow-[0_20px_50px_-24px_rgba(30,70,120,0.5)]">
              <CompanyMark
                name={company.name}
                gradient={company.gradient}
                size={64}
              />
            </div>

            <div className="min-w-0">
              <h1
                className={`text-[44px] leading-[1.02] tracking-[-0.01em] md:text-[72px] ${fSerif}`}
              >
                {company.name} <em>{company.role}</em>
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-800">
                {company.tagline}
              </p>
            </div>
          </div>

          {/* stats strip */}
          <div
            className={`mt-10 grid grid-cols-2 rounded-[28px] md:grid-cols-4 ${glass}`}
          >
            {stats.map(({ Icon, label, value }, i) => (
              <div
                key={label}
                className={`p-5 md:p-6 ${
                  i > 0 ? "md:border-l md:border-white/70" : ""
                } ${i % 2 === 1 ? "border-l border-white/70 md:border-l" : ""} ${
                  i > 1 ? "border-t border-white/70 md:border-t-0" : ""
                }`}
              >
                <Icon size={18} className="text-slate-700" />
                <p className="mt-4 text-xs text-slate-600">{label}</p>
                <p className="mt-1 text-[26px] leading-none">
                  <span className={fSerif}>{value}</span>
                </p>
              </div>
            ))}

            <div className="col-span-2 border-t border-white/70 p-5 md:col-span-1 md:border-l md:border-t-0 md:p-6">
              <Gauge size={18} className="text-slate-700" />
              <p className="mt-4 text-xs text-slate-600">Difficulty</p>
              <p className="mt-1 flex items-center gap-2 text-[26px] leading-none">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                <span className={fSerif}>{company.difficulty}</span>
              </p>
              <div className="mt-3">
                <Ticks level={level} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Details panel ================= */}
      <section
        className="relative mt-4 overflow-hidden rounded-[28px] px-5 py-10 sm:px-8 md:rounded-[44px] md:px-12 md:py-14"
        style={skyB}
      >
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
          <div className="space-y-6">
            {/* pattern */}
            <div className={`rounded-[30px] p-6 md:p-8 ${glass}`}>
              <h2
                className={`flex items-center gap-3 text-[32px] leading-none ${fSerif}`}
              >
                <FileText size={22} className="text-slate-700" />
                Assessment pattern
              </h2>

              <div className="mt-6 overflow-x-auto">
                <div className="min-w-[520px]">
                  <div
                    className={`grid grid-cols-[40px_1fr_100px_90px_70px] border-b border-white/80 pb-3 text-xs text-slate-600 ${fMono}`}
                  >
                    <span>#</span>
                    <span>Section</span>
                    <span>Type</span>
                    <span>Questions</span>
                    <span className="text-right">Marks</span>
                  </div>
                  {company.sections.map((s, i) => (
                    <div
                      key={s.name}
                      className="grid grid-cols-[40px_1fr_100px_90px_70px] items-center border-b border-white/60 py-4 text-sm last:border-b-0"
                    >
                      <span className={`text-slate-500 ${fMono}`}>{i + 1}</span>
                      <span className="font-medium">{s.name}</span>
                      <span>
                        <span
                          className={`rounded-[3px] px-1.5 py-0.5 text-[11px] ${fMono}`}
                          style={{ backgroundColor: LIME }}
                        >
                          {s.type}
                        </span>
                      </span>
                      <span className={fMono}>{s.count}</span>
                      <span className={`text-right font-semibold ${fMono}`}>
                        {s.marks}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className={`mt-5 text-xs text-slate-600 ${fMono}`}>
                Languages: Java | C++ | Python | JavaScript
              </p>
            </div>

            {/* instructions */}
            <div className={`rounded-[30px] p-6 md:p-8 ${glass}`}>
              <h2 className={`text-[32px] leading-none ${fSerif}`}>
                Instructions
              </h2>
              <ul className="mt-6 space-y-3.5">
                {generalInstructions.map((t) => (
                  <li
                    key={t}
                    className="flex gap-3 text-[14px] leading-6 text-slate-800"
                  >
                    <Check
                      size={17}
                      strokeWidth={2.4}
                      className="mt-1 shrink-0 text-slate-800"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* topics */}
            <div className={`rounded-[30px] p-6 md:p-8 ${glass}`}>
              <h2 className={`text-[32px] leading-none ${fSerif}`}>
                Topics covered
              </h2>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {company.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-[4px] px-2.5 py-1 text-[13px]"
                    style={{ backgroundColor: LIME }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* mode + start */}
          <aside className="lg:sticky lg:top-6">
            <div className={`rounded-[30px] p-6 ${glass}`}>
              <h2 className={`text-[32px] leading-none ${fSerif}`}>
                Choose a mode
              </h2>

              <div className="mt-5 space-y-3">
                {(["practice", "interview"] as const).map((m) => {
                  const on = mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      aria-pressed={on}
                      className={`w-full rounded-[22px] border p-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                        on
                          ? "border-slate-900 bg-white/80"
                          : "border-white/70 bg-white/30 hover:bg-white/55"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] font-semibold capitalize">
                          {m} mode
                        </span>
                        <span
                          className={`grid h-5 w-5 place-items-center rounded-full border ${
                            on
                              ? "border-slate-900 bg-slate-900"
                              : "border-slate-500"
                          }`}
                        >
                          {on && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>
                      </div>
                      <ul
                        className={`mt-3 space-y-1.5 text-xs leading-5 text-slate-700 ${fMono}`}
                      >
                        {modeRules[m].map((r) => (
                          <li key={r}>- {r}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-800">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-slate-900"
                />
                I have read the instructions and agree to the assessment rules.
              </label>

              <button
                type="button"
                disabled={!agreed}
                onClick={proceed}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full text-[15px] font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundColor: INK }}
              >
                Continue to system check <ArrowRight size={18} />
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}