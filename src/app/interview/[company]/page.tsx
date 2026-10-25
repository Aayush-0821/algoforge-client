
"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  getCompanyAssessments,
  type CompanyAssessment,
  type CompanyAssessmentsResponse,
} from "@/src/lib/mockoa/api";

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
  const total = 20;
  const filled = Math.round(level * total);

  return (
    <div className="flex h-4 items-stretch gap-[3px]" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`w-[2px] rounded-full ${
            index < filled ? "bg-[#8ccf00]" : "bg-slate-500/25"
          }`}
        />
      ))}
    </div>
  );
}

function formatTier(tier: string) {
  return tier.replaceAll("_", " ").toLowerCase();
}

export default function CompanyOverviewPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company: slug } = use(params);
  const router = useRouter();
  const { setup } = useInterview();

  const [mode, setMode] = useState<Mode>("practice");
  const [agreed, setAgreed] = useState(false);
  const [selectedAssessment, setSelectedAssessment] =
    useState<CompanyAssessment | null>(null);
  const [response, setResponse] =
    useState<CompanyAssessmentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Optional presentation metadata from the old company catalogue.
  // Assessment data itself always comes from the backend.
  const companyMeta = getCompany(slug);

  useEffect(() => {
    let active = true;

    async function loadAssessments() {
      setLoading(true);
      setError("");

      try {
        const result = await getCompanyAssessments(slug);

        if (active) {
          setResponse(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load assessments.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadAssessments();

    return () => {
      active = false;
    };
  }, [slug]);

  const companyName =
    response?.company?.name ??
    companyMeta?.name ??
    slug.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const assessments = response?.assessments ?? [];
  const totalQuestions = assessments.reduce(
    (total, assessment) => total + assessment.totalQuestions,
    0,
  );
  const totalMarks = assessments.reduce(
    (total, assessment) => total + assessment.totalMarks,
    0,
  );

  const proceed = () => {
    if (!selectedAssessment || !agreed) return;

    setup(slug, mode);

    router.push(
      `/interview/${slug}/system-check?assessmentId=${encodeURIComponent(
        selectedAssessment.id,
      )}`,
    );
  };

  const stats = [
    {
      Icon: FileText,
      label: "Published OAs",
      value: String(assessments.length),
    },
    {
      Icon: ListChecks,
      label: "Total questions",
      value: String(totalQuestions),
    },
    {
      Icon: Trophy,
      label: "Combined marks",
      value: String(totalMarks),
    },
  ];

  const difficulty = companyMeta?.difficulty ?? "Varies by OA";
  const difficultyLevel =
    difficulty.toLowerCase() === "hard"
      ? 0.92
      : difficulty.toLowerCase() === "easy"
        ? 0.3
        : 0.62;

  return (
    <div
      className={`${mono.variable} ${serif.variable} min-h-screen bg-white px-3 py-3 sm:px-6 sm:py-6`}
      style={{ color: INK }}
    >
      <section
        className="relative overflow-hidden rounded-[28px] px-5 py-8 sm:px-8 md:rounded-[44px] md:px-12 md:py-10"
        style={skyHero}
      >
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/interview"
            className={`group inline-flex items-center gap-2 text-xs text-slate-800 transition-colors hover:text-slate-950 ${fMono}`}
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
                name={companyName}
                gradient={companyMeta?.gradient ?? "from-slate-700 to-slate-500"}
                size={64}
              />
            </div>

            <div className="min-w-0">
              <h1
                className={`text-[44px] leading-[1.02] tracking-[-0.01em] md:text-[72px] ${fSerif}`}
              >
                {companyName} <em>Assessments</em>
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-800">
                {companyMeta?.tagline ??
                  `Explore published online assessments for ${companyName}. Choose a test to review its format and begin your preparation.`}
              </p>
            </div>
          </div>

          <div className={`mt-10 grid grid-cols-1 rounded-[28px] sm:grid-cols-3 ${glass}`}>
            {stats.map(({ Icon, label, value }, index) => (
              <div
                key={label}
                className={`p-5 md:p-6 ${
                  index > 0 ? "border-t border-white/70 sm:border-l sm:border-t-0" : ""
                }`}
              >
                <Icon size={18} className="text-slate-700" />
                <p className="mt-4 text-xs text-slate-600">{label}</p>
                <p className="mt-1 text-[26px] leading-none">
                  <span className={fSerif}>{value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative mt-4 overflow-hidden rounded-[28px] px-5 py-8 sm:px-8 md:rounded-[44px] md:px-12 md:py-12"
        style={skyB}
      >
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-6">
            <div className={`rounded-[30px] p-6 md:p-8 ${glass}`}>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className={`text-[32px] leading-none ${fSerif}`}>
                    Available assessments
                  </h2>
                  <p className="mt-3 text-sm text-slate-700">
                    Select an OA to see its details before starting.
                  </p>
                </div>
                <span className={`text-xs text-slate-600 ${fMono}`}>
                  {assessments.length} AVAILABLE
                </span>
              </div>

              {loading && (
                <div className="mt-8 space-y-3" aria-live="polite">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-28 animate-pulse rounded-[22px] border border-white/70 bg-white/35"
                    />
                  ))}
                  <p className="text-sm text-slate-600">
                    Loading assessments…
                  </p>
                </div>
              )}

              {!loading && error && (
                <div
                  role="alert"
                  className="mt-6 rounded-2xl border border-red-300/70 bg-red-50/70 p-5"
                >
                  <p className="font-medium text-red-900">
                    Could not load assessments
                  </p>
                  <p className="mt-2 break-words text-sm text-red-800">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => router.refresh()}
                    className="mt-4 text-sm font-semibold underline"
                  >
                    Refresh page
                  </button>
                </div>
              )}

              {!loading && !error && assessments.length === 0 && (
                <div className="mt-6 rounded-[22px] border border-white/70 bg-white/30 p-8">
                  <FileText size={24} className="text-slate-700" />
                  <h3 className={`mt-4 text-2xl ${fSerif}`}>
                    No published OAs yet
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-700">
                    There are currently no published assessments for this
                    company. Imported questions must be added to an assessment
                    and published before they appear here.
                  </p>
                </div>
              )}

              {!loading && !error && assessments.length > 0 && (
                <div className="mt-6 space-y-3">
                  {assessments.map((assessment) => {
                    const selected = selectedAssessment?.id === assessment.id;

                    return (
                      <button
                        key={assessment.id}
                        type="button"
                        onClick={() => {
                          setSelectedAssessment(assessment);
                          setAgreed(false);
                        }}
                        aria-pressed={selected}
                        className={`w-full rounded-[22px] border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-white/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                          selected
                            ? "border-slate-900 bg-white/75 shadow-lg shadow-slate-900/5"
                            : "border-white/70 bg-white/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className={`text-2xl leading-tight ${fSerif}`}>
                              {assessment.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-700">
                              {assessment.description ||
                                "Company assessment practice"}
                            </p>
                          </div>

                          <span
                            className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                              selected
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-500 text-transparent"
                            }`}
                          >
                            <Check size={14} />
                          </span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-700">
                          <span className="flex items-center gap-2">
                            <Clock3 size={15} />
                            {assessment.durationMinutes} min
                          </span>
                          <span className="flex items-center gap-2">
                            <ListChecks size={15} />
                            {assessment.totalQuestions} questions
                          </span>
                          <span className="flex items-center gap-2">
                            <Trophy size={15} />
                            {assessment.totalMarks} marks
                          </span>
                          {assessment.passingMarks !== null && (
                            <span>
                              Pass mark: {assessment.passingMarks}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span
                            className={`rounded-[4px] px-2 py-1 text-[10px] uppercase tracking-wide ${fMono}`}
                            style={{ backgroundColor: LIME }}
                          >
                            {formatTier(assessment.subscriptionTier)}
                          </span>
                          <span className="rounded-[4px] bg-white/60 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-700">
                            Published
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={`rounded-[30px] p-6 md:p-8 ${glass}`}>
              <h2 className={`text-[32px] leading-none ${fSerif}`}>
                Instructions
              </h2>
              <ul className="mt-6 space-y-3.5">
                {generalInstructions.map((instruction) => (
                  <li
                    key={instruction}
                    className="flex gap-3 text-[14px] leading-6 text-slate-800"
                  >
                    <Check
                      size={17}
                      strokeWidth={2.4}
                      className="mt-1 shrink-0 text-slate-800"
                    />
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className={`rounded-[30px] p-6 ${glass}`}>
              <h2 className={`text-[32px] leading-none ${fSerif}`}>
                Assessment setup
              </h2>

              <div className="mt-5 rounded-2xl border border-white/70 bg-white/35 p-4">
                <p className={`text-[10px] uppercase tracking-wider text-slate-600 ${fMono}`}>
                  Selected OA
                </p>
                <p className={`mt-2 text-xl ${fSerif}`}>
                  {selectedAssessment?.title ?? "Choose an assessment"}
                </p>
                {selectedAssessment && (
                  <p className="mt-2 text-xs text-slate-700">
                    {selectedAssessment.durationMinutes} minutes ·{" "}
                    {selectedAssessment.totalQuestions} questions
                  </p>
                )}
              </div>

              <h3 className="mt-6 text-sm font-semibold">Choose a mode</h3>

              <div className="mt-3 space-y-3">
                {(["practice", "interview"] as const).map((option) => {
                  const selected = mode === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMode(option)}
                      aria-pressed={selected}
                      className={`w-full rounded-[22px] border p-4 text-left transition ${
                        selected
                          ? "border-slate-900 bg-white/80"
                          : "border-white/70 bg-white/30 hover:bg-white/55"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize">
                          {option} mode
                        </span>
                        <span
                          className={`grid h-5 w-5 place-items-center rounded-full border ${
                            selected
                              ? "border-slate-900 bg-slate-900"
                              : "border-slate-500"
                          }`}
                        >
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>
                      </div>

                      <ul className={`mt-3 space-y-1.5 text-xs leading-5 text-slate-700 ${fMono}`}>
                        {modeRules[option].map((rule) => (
                          <li key={rule}>- {rule}</li>
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
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-slate-900"
                />
                I have read the instructions and agree to the assessment rules.
              </label>

              <button
                type="button"
                disabled={!selectedAssessment || !agreed || loading}
                onClick={proceed}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full text-[15px] font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundColor: INK }}
              >
                Continue to system check <ArrowRight size={18} />
              </button>

              <p className={`mt-4 text-center text-[10px] leading-5 text-slate-600 ${fMono}`}>
                <Gauge size={13} className="mr-1 inline-block" />
                Your assessment selection is required to continue.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
