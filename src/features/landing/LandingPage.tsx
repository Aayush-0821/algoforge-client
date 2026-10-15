"use client";

import { ReactNode, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { AppWindow, ArrowUpRight, Check, Play } from "lucide-react";

import ParticleField from "./ParticleField";
import CardOrbit from "./CardOrbit";
import Footer from "./Footer";
import FeaturesShowcase from "./FeaturesShowcase";
import { navLinks } from "./navbar/nav-links";
import { supportedPlatforms, chromeStoreStats } from "./extension/extension-data";
import { solution, analysis, recommendations } from "./showcase/data";
import { plans, comparisonFeatures, pricingFooter } from "./pricing/pricing-data";
import { H1, P, TAG, Reveal, Rise, Scene, SpotCard, Words } from "./ScrollKit";

/* ---------- Floating pill nav (theme toggle removed, spacing tightened) ---------- */
function Nav() {
  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-3xl items-center justify-between gap-8 rounded-2xl border border-white/10 bg-black/45 py-2 pl-5 pr-2 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white">
          <Image src="/logo.svg" alt="" width={24} height={24} className="rounded-md" priority />
          Algo<span className="-ml-1.5 text-orange-500">Forge</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
              {l.title}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden px-3 text-sm text-neutral-300 transition-colors hover:text-white sm:block">
            Login
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-2 text-sm text-white transition-colors hover:bg-white/10"
          >
            Get Started <ArrowUpRight size={14} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ---------- Paper panel: always light now ---------- */
function Panel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 20%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [72, 28]);
  return (
    <motion.div
      id="dashboard"
      ref={ref}
      style={{ scale, borderTopLeftRadius: radius, borderTopRightRadius: radius, transformOrigin: "50% 0%" }}
      className="relative z-10 bg-[#f3f3f1] text-neutral-900"
    >
      <div className="absolute inset-x-[12%] -top-px h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      {children}
    </motion.div>
  );
}

/* ---------- Workspace: browser-style frame on an ember gradient ---------- */
function Workspace() {
  return (
    <Reveal delay={0.15} className="self-start">
      <div className="rounded-3xl bg-gradient-to-br from-orange-500 via-orange-700 to-rose-950 p-4 shadow-[0_40px_90px_-30px_rgba(234,88,12,0.55)]">
        <div className="overflow-hidden rounded-xl bg-neutral-950 text-white">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
            <i className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <i className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <i className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className={`${TAG} ml-3`}>AF WORKSPACE</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-6">
            {solution.map((l, n) => (
              <motion.div
                key={l.id}
                animate={l.highlight ? { backgroundColor: ["rgba(249,115,22,0.10)", "rgba(249,115,22,0.28)", "rgba(249,115,22,0.10)"] } : undefined}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className={`-mx-2 flex px-2 ${l.highlight ? "rounded border-l-2 border-orange-400" : ""}`}
              >
                <span className="w-6 shrink-0 select-none text-white/25">{n + 1}</span>
                <span>{l.text || "\u00A0"}</span>
              </motion.div>
            ))}
          </pre>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- Pricing: window-style cards on an ember sky (follows the pricing reference) ---------- */
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

function includeRow(title: string, v: any) {
  const off = v && typeof v === "object";
  const extra = typeof v === "string" ? v : off ? v.label : "";
  return { off, text: extra ? `${sentence(title)} · ${extra}` : sentence(title) };
}

function PlanCard({ p }: { p: (typeof plans)[number] }) {
  const hot = !!p.highlighted;
  const badge = (p as any).badge as string | undefined;
  return (
    <div className="relative flex w-full">
      {badge && (
        <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-900/20 bg-white px-3 py-0.5 text-xs text-neutral-800 shadow-sm">
          {badge}
        </span>
      )}
      <div
        className={`flex w-full flex-col overflow-hidden rounded-xl border bg-white/70 backdrop-blur-md ${
          hot
            ? "border-orange-700/50 shadow-[0_30px_80px_-30px_rgba(194,65,12,0.6)]"
            : "border-neutral-900/25 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className={`flex items-center gap-1.5 px-3 py-2 ${hot ? "bg-orange-500/80" : "bg-neutral-900/10"}`}>
          <i className="h-2 w-2 rounded-full bg-red-400" />
          <i className="h-2 w-2 rounded-full bg-yellow-400" />
          <i className="h-2 w-2 rounded-full bg-green-400" />
        </div>

        <div className="flex flex-1 flex-col px-7 pb-8 pt-8">
          <div className="text-center">
            <h3 className="text-2xl font-light lowercase">{p.name}</h3>
            <p className="mt-2 text-sm text-neutral-600">{p.description}</p>

            <div className="my-6 border-t border-dashed border-neutral-900/20" />

            <p className="text-6xl font-light tracking-tight">{p.price}</p>
            <p className="mt-1 text-sm text-neutral-600">{p.period}</p>

            <Link
              href="/signup"
              className={`mt-6 inline-block rounded-full border px-6 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                hot
                  ? "border-orange-700/50 bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                  : "border-neutral-900/20 bg-gradient-to-b from-white to-neutral-200 text-neutral-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
              }`}
            >
              {p.button}
            </Link>
          </div>

          <div className="my-6 border-t border-dashed border-neutral-900/20" />

          <p className="text-sm text-neutral-500">includes</p>
          <ul className="mt-4 space-y-3">
            {comparisonFeatures.map((f) => {
              const row = includeRow(f.title, hot ? f.pro : f.free);
              return (
                <li key={f.title} title={f.description} className="flex items-start gap-3 text-sm">
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                      row.off ? "bg-neutral-900/15 text-neutral-500" : "bg-neutral-900 text-white"
                    }`}
                  >
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span className={row.off ? "text-neutral-500" : ""}>{row.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="px-4 pb-20 pt-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#ea580c_0%,#fb923c_28%,#fed7aa_58%,#f3f3f1_92%)] px-6 pb-16 pt-20 md:px-10 md:pt-24">
        {/* soft clouds */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-24 h-56 w-[28rem] rounded-full bg-white/50 blur-3xl" />
          <div className="absolute -right-24 top-40 h-64 w-[32rem] rounded-full bg-orange-100/60 blur-3xl" />
          <div className="absolute left-1/3 top-[55%] h-60 w-[36rem] rounded-full bg-white/60 blur-3xl" />
          <div className="absolute -right-10 bottom-20 h-48 w-96 rounded-full bg-white/50 blur-3xl" />
        </div>

        <div className="relative text-center">
          <span className="inline-block rounded-full border border-white/40 bg-white/25 px-3 py-1 text-xs text-white backdrop-blur">
            Pricing
          </span>
          <h2 className="mt-5 text-5xl font-light tracking-[-0.04em] text-white md:text-6xl">
            <Words text="Start free. Upgrade when ready." />
          </h2>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-2">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1} className="flex">
              <PlanCard p={p} />
            </Reveal>
          ))}
        </div>

        <ul className="relative mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-3 border-t border-dashed border-neutral-900/20 pt-8 text-sm text-neutral-700">
          {pricingFooter.map((f) => (
            <li key={f.text} className="flex items-center gap-2">
              <f.icon size={15} />
              {f.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main className="relative bg-[#060504] text-white">
      <ParticleField />
      <CardOrbit />
      <Nav />

      {/* 1 · Hero — unchanged */}
      <Scene first>
        <div className="relative isolate flex-1 w-full overflow-visible">
          {/* Upper-left headline */}
          <div className="absolute left-0 top-[5%] z-10 max-w-[92vw] md:left-[2%] md:top-[7%] md:max-w-[min(760px,64vw)]">
            <h1 className={`${H1} text-left text-[clamp(3.25rem,7.8vw,7.5rem)]`}>
              <span className="block"><Words text="Stop Solving" /></span>
              <span className="block">
                <Words
                  text="Start Forging."
                  offset={2}
                  className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 bg-clip-text text-transparent"
                />
              </span>
            </h1>
          </div>

          {/* Lower-right product story and actions */}
          <Rise className="absolute bottom-[2%] right-0 z-10 flex w-full max-w-[440px] flex-col items-start gap-5 text-left sm:bottom-[4%] md:right-[2%] md:w-[38%] md:max-w-[460px]">
            <div className="flex flex-wrap gap-x-4 gap-y-2"></div>
            <p className={`${P} max-w-[420px] text-[14px] leading-7 text-neutral-300 md:text-[15px]`}>
              AlgoForge analyzes your coding habits, uncovers weak concepts, and creates a personalized roadmap that helps you master algorithms faster and crack coding interviews with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-medium text-white shadow-[0_12px_40px_-16px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-[0_16px_48px_-16px_rgba(249,115,22,0.75)]"
              >
                Start Forging <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.025] px-5 py-3.5 text-sm text-neutral-200 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.07]">
                <Play size={14} /> Watch Demo
              </button>
            </div>
          </Rise>

          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[48%] z-[1] hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:flex"></div>
        </div>
      </Scene>

      {/* 2 · Features — scattered particles + alternating image rows */}
      <FeaturesShowcase />

      {/* 3 · Extension — unchanged for now */}
      <Scene id="extension">
        <div className="text-center">
          <h2 className={H1}>
            <Words text="Install Once." />
            <br />
            <Words text="Everything Else Just Works." offset={2} />
          </h2>
          <Rise className={`${P} mx-auto mt-5 max-w-md`}>Add AlgoForge to Chrome and your progress syncs automatically as you solve.</Rise>
          <Rise delay={0.05}>
            <button className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-medium transition-colors hover:bg-orange-400">
              <AppWindow size={16} /> Add to Chrome
            </button>
          </Rise>
        </div>
        <Rise delay={0.1} className="mt-auto grid grid-cols-3 gap-3 text-center">
          {[
            [chromeStoreStats.rating, "Chrome Store rating"],
            [chromeStoreStats.users.replace(" Developers", ""), "Developers"],
            [String(supportedPlatforms.length), "Supported platforms"],
          ].map(([n, l]) => (
            <SpotCard key={l} className="px-3 py-5">
              <p className="text-3xl font-light md:text-5xl">{n}</p>
              <p className="mt-1 text-xs text-neutral-500">{l}</p>
            </SpotCard>
          ))}
        </Rise>
      </Scene>

      {/* 4 · Workspace + pricing — light panel */}
      <Panel>
        <div className="mx-auto grid max-w-6xl gap-14 px-6 pb-8 pt-28 lg:grid-cols-[1fr_420px]">
          <div>
            <h2 className="text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-7xl">
              <Words text="Everything you need," />
              <br />
              <Words text="right where you solve." offset={3} />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-[15px] leading-7 text-neutral-500">
                Analyze every solution, discover weak topics, receive AI-powered recommendations, and build interview-ready skills
                without leaving your coding platform.
              </p>
            </Reveal>
            <div className="mt-12 grid grid-cols-3 gap-3">
              {analysis.map((a, i) => (
                <Reveal key={a.id} delay={i * 0.1}>
                  <SpotCard paper className="p-4">
                    <p className="font-mono text-[11px] tracking-[0.18em] text-neutral-500">{a.title}</p>
                    <p className="mt-2 text-2xl font-light md:text-3xl">{a.value}</p>
                    <div className="mt-3 h-px w-full bg-gradient-to-r from-orange-500 to-transparent" />
                  </SpotCard>
                </Reveal>
              ))}
            </div>
            <ul className="mt-12 divide-y divide-black/10 border-y border-black/10">
              {recommendations.map((r, i) => (
                <li key={r.id}>
                  <Reveal delay={i * 0.06}>
                    <div className="group flex items-center justify-between py-4 text-sm transition-all duration-300 hover:pl-3">
                      <span className="flex items-center gap-3">
                        <ArrowUpRight size={14} className="-ml-5 text-orange-500 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100" />
                        {r.title}
                      </span>
                      <span className="text-neutral-500">{r.topic} · {r.difficulty}</span>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
          <Workspace />
        </div>
        <Pricing />
      </Panel>

      {/* 5 · Dark footer */}
      <Footer />
    </main>
  );
}