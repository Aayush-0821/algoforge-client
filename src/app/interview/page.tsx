"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock3,
  Code2,
  FileText,
  RotateCw,
  Search,
} from "lucide-react";
import {
  Instrument_Serif,
  JetBrains_Mono,
  Pixelify_Sans,
} from "next/font/google";

import { companies, sectionSummary } from "@/src/lib/interview/data";
import CompanyMark from "@/src/components/interview/CompanyMark";

/* ------------------------------------------------------------------ */
/* Fonts: pixel display (hero), mono (small UI text), serif (panels)   */
/* ------------------------------------------------------------------ */
const pixel = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-pixel",
});
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

const fPixel = "[font-family:var(--font-pixel),monospace]";
const fMono = "[font-family:var(--font-mono-ui),ui-monospace,monospace]";
const fSerif = "[font-family:var(--font-serif-ui),Georgia,serif]";

const filters = ["All", "SDE", "Frontend", "Backend", "Data", "Aptitude"];

const rail = [
  { id: "intro", label: "Intro" },
  { id: "assessments", label: "Library" },
  { id: "how-it-works", label: "Process" },
];

const INK = "#0f1720";
const LIME = "#e3f78a";

/* Sky backdrop shared by both panels (CSS only, no images) */
const skyA = {
  background: `
    radial-gradient(ellipse 55% 38% at 12% 8%, rgba(255,255,255,0.75), transparent 70%),
    radial-gradient(ellipse 50% 40% at 88% 22%, rgba(255,255,255,0.65), transparent 70%),
    radial-gradient(ellipse 70% 35% at 40% 100%, rgba(255,255,255,0.9), transparent 70%),
    linear-gradient(180deg, #5ea2dd 0%, #94bde4 40%, #d6e6f4 100%)
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

/* ------------------------------------------------------------------ */
/* Hero: live ASCII field drawn on a canvas                            */
/* ------------------------------------------------------------------ */
function AsciiField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const RAMP = " .:-=+*#%@";
    const FONT = 15;
    const CW = 9;
    const LH = 18;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let time = 2;

    const sample = (c: number, r: number, t: number) => {
      const x = c / cols;
      const y = r / rows;
      const v =
        Math.sin(x * 7 + t * 0.45) +
        Math.sin(y * 6 - t * 0.35) +
        Math.sin((x + y) * 8 + t * 0.25) +
        Math.sin(Math.hypot(x - 0.72, (y - 0.4) * 0.6) * 14 - t * 0.7);
      return (v + 4) / 8;
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = sample(c, r, t);
          const k = Math.max(0, (v - 0.42) / 0.58);
          const idx = Math.min(
            RAMP.length - 1,
            Math.floor(Math.pow(k, 1.4) * RAMP.length)
          );
          if (idx === 0) continue;
          ctx.fillStyle =
            k > 0.78
              ? "rgba(249,115,22,0.8)"
              : `rgba(255,255,255,${0.05 + k * 0.2})`;
          ctx.fillText(RAMP[idx], c * CW, r * LH);
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT}px ui-monospace, Menlo, monospace`;
      ctx.textBaseline = "top";
      cols = Math.ceil(w / CW);
      rows = Math.ceil(h / LH);
      draw(time);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 66) return;
      last = now;
      time = now / 1000;
      draw(time);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/* One orchestrated moment: the headline types itself in */
function TypedHeadline({ lines }: { lines: string[] }) {
  const total = lines.join("").length;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(total);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= total) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [total]);

  let used = 0;
  return (
    <>
      {lines.map((line, li) => {
        const shown = Math.max(0, Math.min(line.length, n - used));
        const isLast = li === lines.length - 1;
        const active =
          (shown > 0 && shown < line.length) || (isLast && n >= total);
        used += line.length;
        return (
          <span key={line} className="block">
            {line.slice(0, shown)}
            {active && (
              <span className="relative inline-block w-0">
                <span className="absolute -top-[0.78em] left-[0.04em] h-[0.78em] w-[0.42em] animate-pulse bg-orange-500" />
              </span>
            )}
            <span className="invisible">{line.slice(shown)}</span>
          </span>
        );
      })}
    </>
  );
}


/* Difficulty drawn as a tick gauge (echoes the progress bar in the reference) */
function Ticks({ level }: { level: number }) {
  const TOTAL = 28;
  const filled = Math.round(level * TOTAL);
  return (
    <div className="flex h-5 items-stretch gap-[3px]" aria-hidden="true">
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

const Mark = ({ children }: { children: React.ReactNode }) => (
  <mark
    className="rounded-[3px] px-1 text-inherit"
    style={{ backgroundColor: LIME }}
  >
    {children}
  </mark>
);

export default function InterviewHomePage() {
  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const companyCount = companies.length;

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const searchable = [
        company.name,
        company.role,
        company.tagline,
        ...company.topics,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchable.includes(q.toLowerCase());

      const categoryText = [company.role, company.tagline, ...company.topics]
        .join(" ")
        .toLowerCase();

      const matchesCategory =
        activeFilter === "All" ||
        categoryText.includes(activeFilter.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" ||
        company.difficulty.toLowerCase() === difficulty.toLowerCase();

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [q, activeFilter, difficulty]);

  const glass =
    "border border-white/70 bg-white/45 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_24px_60px_-28px_rgba(30,70,120,0.4)]";

  return (
    <div
      className={`${pixel.variable} ${mono.variable} ${serif.variable} min-h-screen bg-white`}
      style={{ color: INK }}
    >
    

      {/* ================= Hero ================= */}
      <section
        id="intro"
        className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0a0a0a] text-[#F4F1E8]"
      >
        <AsciiField />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_52%,rgba(10,10,10,0.8),transparent_62%)]"
        />

        <div className="relative z-10 flex flex-1 flex-col px-5 sm:px-8 lg:px-12 lg:pr-24">
          {/* top bar */}
          <header className="flex h-[76px] shrink-0 items-center justify-between">
            <Link
              href="/dashboard"
              aria-label="AlgoForge dashboard"
              className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              <Code2 size={26} strokeWidth={2.6} className="text-orange-500" />
              <span
                className={`text-xl font-semibold tracking-tight `}
              >
                MockOA By AlgoForge
              </span>
            </Link>

            <Link
              href="/dashboard"
              className={`group inline-flex items-center gap-2 text-xs text-white/70 transition-colors hover:text-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500 ${fMono}`}
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="hidden sm:inline">Back to dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </header>

          {/* headline */}
          <div className="flex flex-1 items-center py-14">
            <h1
              className={`text-[clamp(40px,8.4vw,132px)] font-semibold uppercase leading-[1.04] tracking-[-0.01em] ${fPixel}`}
              aria-label="Practice like it's real."
            >
              <span aria-hidden="true">
                <TypedHeadline lines={["Practice like", "it's real."]} />
              </span>
            </h1>
          </div>

          {/* bottom row */}
          <div className="shrink-0 border-t border-white/25 pb-6 pt-6">
            <div className="grid items-end gap-4 lg:grid-cols-[1fr_1.1fr_1.1fr] lg:gap-5">
              <p
                className={`max-w-sm text-[13px] leading-6 text-white/80 ${fMono}`}
              >
                Real company assessment patterns. A focused coding
                environment. Actionable AI feedback.
              </p>

              <a
                href="#assessments"
                className={`flex h-16 items-center justify-between bg-[#F4F1E8] px-6 text-[13px] uppercase tracking-wide text-black transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${fMono}`}
              >
                Explore assessments
                <ArrowDown size={15} />
              </a>

              <a
                href="#how-it-works"
                className={`flex h-16 items-center justify-between border border-white/70 px-6 text-[13px] uppercase tracking-wide text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${fMono}`}
              >
                How it works
                <ArrowDown size={15} />
              </a>
            </div>

           
          </div>
        </div>
      </section>

      {/* ================= Library ================= */}
      <section
        id="assessments"
        className="scroll-mt-4 px-3 pt-4 sm:px-6 sm:pt-6"
      >
        <div
          className="relative overflow-hidden rounded-[28px] px-5 py-12 sm:px-8 md:rounded-[44px] md:px-12 md:py-16"
          style={skyA}
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2
                className={`max-w-2xl text-[40px] leading-[1.05] tracking-[-0.01em] md:text-[58px] ${fSerif}`}
              >
                Every company tests differently.{" "}
                <em>Practice the one you&apos;re facing.</em>
              </h2>

              <p className={`shrink-0 text-sm text-slate-700 ${fMono}`}>
                {filteredCompanies.length} of {companyCount} assessments
              </p>
            </div>

            {/* search + filters */}
            <div className="mt-10 flex flex-col gap-4">
              <div
                className={`flex max-w-xl items-center gap-3 rounded-2xl px-4 transition focus-within:border-white focus-within:bg-white/70 ${glass}`}
              >
                <Search size={18} className="text-slate-600" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search companies, roles or skills"
                  aria-label="Search assessments"
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="text-xs text-slate-600 hover:text-slate-900"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => {
                  const on = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      aria-pressed={on}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                        on
                          ? "text-white"
                          : "border border-white/70 bg-white/40 text-slate-700 backdrop-blur hover:bg-white/70"
                      }`}
                      style={on ? { backgroundColor: INK } : undefined}
                    >
                      {filter}
                    </button>
                  );
                })}

                <div className="sm:ml-auto">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    aria-label="Filter by difficulty"
                    className="rounded-full border border-white/70 bg-white/50 px-4 py-2.5 text-xs text-slate-700 outline-none backdrop-blur transition focus:bg-white/80"
                  >
                    <option value="All">All difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCompanies.map((company) => {
                const d = company.difficulty.toLowerCase();
                const level = d === "hard" ? 0.92 : d === "easy" ? 0.3 : 0.62;
                const dot =
                  d === "hard"
                    ? "bg-red-500"
                    : d === "easy"
                      ? "bg-emerald-500"
                      : "bg-amber-500";

                return (
                  <motion.div
                    layout
                    key={company.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Link
                      href={`/interview/${company.slug}`}
                      className={`group flex h-full flex-col rounded-[26px] p-6 transition-colors hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${glass}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-white/80">
                          <CompanyMark
                            name={company.name}
                            gradient={company.gradient}
                            size={38}
                          />
                        </div>
                        <div className="min-w-0">
                          <h3
                            className={`truncate text-[28px] leading-none ${fSerif}`}
                          >
                            {company.name}
                          </h3>
                          <p className="mt-1.5 truncate text-[13px] text-slate-600">
                            {company.role}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 min-h-[48px] text-[13px] leading-6 text-slate-700">
                        {company.tagline}
                      </p>

                      {/* difficulty gauge */}
                      <div className="mt-5">
                        <Ticks level={level} />
                        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-700">
                          <span className="inline-flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${dot}`}
                            />
                            {company.difficulty}
                          </span>
                          <span className="inline-flex items-center gap-4 text-slate-600">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 size={13} />
                              {company.durationMins} min
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <FileText size={13} />
                              {sectionSummary(company)}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                        <div className="flex flex-wrap gap-1.5 text-[12px]">
                          {company.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="rounded-[3px] px-1.5 py-0.5"
                              style={{ backgroundColor: LIME }}
                            >
                              {topic}
                            </span>
                          ))}
                          {company.topics.length > 3 && (
                            <span className="py-0.5 text-slate-600">
                              +{company.topics.length - 3}
                            </span>
                          )}
                        </div>

                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45"
                          style={{ backgroundColor: INK }}
                          aria-label={`View ${company.name} assessment`}
                        >
                          <ArrowUpRight size={17} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {filteredCompanies.length === 0 && (
              <div
                className={`mt-8 rounded-3xl p-12 text-center ${glass}`}
              >
                <Search size={26} className="mx-auto text-slate-600" />
                <h3 className={`mt-4 text-2xl ${fSerif}`}>
                  No assessments match
                </h3>
                <p className="mt-2 text-sm text-slate-700">
                  Try another company, role or difficulty.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setActiveFilter("All");
                    setDifficulty("All");
                  }}
                  className="mt-5 text-sm font-semibold underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= How it works ================= */}
      <section
        id="how-it-works"
        className="scroll-mt-4 px-3 pb-6 pt-4 sm:px-6"
      >
        <div
          className="relative overflow-hidden rounded-[28px] px-5 py-14 sm:px-8 md:rounded-[44px] md:px-12 md:py-20"
          style={skyB}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2
                className={`max-w-xl text-[40px] leading-[1.05] tracking-[-0.01em] md:text-[58px] ${fSerif}`}
              >
                Walk into your next OA like you&apos;ve <em>already done it.</em>
              </h2>

              <p className="mt-6 max-w-md text-[15px] leading-7 text-slate-800">
                Same flow, same clock, same pressure. Find what slips before
                it counts.
              </p>

              <ul className="mt-8 space-y-3.5 text-[15px]">
                {[
                  <>
                    <Mark>Check camera, mic and screen share</Mark> before you
                    start
                  </>,
                  <>
                    Solve in a <Mark>full-screen code editor</Mark> with your
                    own test cases
                  </>,
                  <>
                    <Mark>Time every section</Mark>, coding and MCQ alike
                  </>,
                  <>
                    Get <Mark>AI feedback</Mark> on each attempt
                  </>,
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      size={17}
                      strokeWidth={2.4}
                      className="mt-1 shrink-0 text-slate-800"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#assessments"
                className="mt-10 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                style={{ backgroundColor: INK }}
              >
                Find your assessment
                <ArrowUpRight size={16} />
              </a>
            </div>

            {/* glass status card, mirrors the reference */}
            <div
              className={`mx-auto w-full max-w-md rounded-[34px] p-7 ${glass}`}
            >
              <div className="flex items-center gap-2 text-[22px]">
                <span className="font-semibold">Mock OA</span>
                <span>in progress</span>
                <RotateCw size={20} className="ml-1" />
              </div>

              <div className="mt-5">
                <Ticks level={0.62} />
              </div>

              <div className="mt-6 space-y-1 text-sm leading-6 text-slate-800">
                <p>Camera, mic and screen share checked.</p>
                <p>2 of 3 coding problems attempted.</p>
                <p>MCQ section not started. 41:20 left.</p>
              </div>

              <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/60 px-4 py-2.5 text-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "#a3e635" }}
                />
                On track
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}