"use client";

import Link from "next/link";
import { use, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, ShieldAlert, Sparkles, Trophy, XCircle } from "lucide-react";
import { getCompany, getQuestions } from "@/src/lib/interview/data";
import { useInterview } from "@/src/lib/interview/store";
import type { McqQuestion } from "@/src/lib/interview/types";

const isRight = (q: McqQuestion, sel: number[] = []) => sel.length === q.correct.length && q.correct.every((i) => sel.includes(i));

export default function ResultPage({ params }: { params: Promise<{ company: string }> }) {
  const { company: slug } = use(params);
  const company = getCompany(slug);
  const router = useRouter();
  const { state } = useInterview();
  const questions = useMemo(() => getQuestions(slug), [slug]);

  useEffect(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    if (!company || !state.finishedAt) router.replace(`/interview/${slug}`);
  }, [company, state.finishedAt, slug, router]);

  if (!company || !state.finishedAt || !state.startedAt) return null;

  const rows = questions.map((q) => {
    const ok = q.type === "mcq" ? isRight(q, state.mcq[q.id]) : state.submissions[q.id]?.status === "accepted";
    const attempted = q.type === "mcq" ? (state.mcq[q.id]?.length ?? 0) > 0 : !!state.submissions[q.id];
    return { q, ok, attempted, score: ok ? q.marks : 0 };
  });
  const total = questions.reduce((a, q) => a + q.marks, 0);
  const got = rows.reduce((a, r) => a + r.score, 0);
  const mins = Math.max(1, Math.round((state.finishedAt - state.startedAt) / 60000));

  return (
    <div className="mx-auto max-w-4xl px-8 py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">{company.name} • {state.mode} mode</p>
      <h1 className="mt-3 text-4xl font-bold">Assessment submitted</h1>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          { i: Trophy, l: "Score", v: `${got} / ${total}` },
          { i: Clock3, l: "Time taken", v: `${mins} min` },
          { i: ShieldAlert, l: "Violations", v: `${state.violations}` },
        ].map(({ i: Icon, l, v }) => (
          <div key={l} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <Icon size={22} className="text-orange-500" />
            <p className="mt-4 text-sm text-zinc-500">{l}</p>
            <p className="mt-1 text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800">
        {rows.map(({ q, ok, attempted, score }, i) => (
          <div key={q.id} className="flex items-center gap-4 border-b border-zinc-800 bg-zinc-900/40 px-6 py-4 last:border-b-0">
            {ok ? <CheckCircle2 size={20} className="text-emerald-500" /> : <XCircle size={20} className={attempted ? "text-red-500" : "text-zinc-600"} />}
            <div className="flex-1">
              <p className="font-medium">Q{i + 1}. {q.title}</p>
              <p className="text-xs uppercase text-zinc-500">{q.type} • {attempted ? (ok ? "Correct" : "Incorrect") : "Not attempted"}</p>
            </div>
            <span className="font-semibold">{score}/{q.marks}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
        <Sparkles className="mt-1 text-orange-500" />
        <div>
          <h3 className="font-semibold">AI report</h3>
          <p className="mt-1 text-sm text-zinc-400">A detailed breakdown of approach, complexity and mistakes will appear here once the backend is connected.</p>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <Link href="/interview" className="rounded-xl border border-zinc-700 px-6 py-3 text-sm transition hover:border-orange-500">All companies</Link>
        <Link href={`/interview/${slug}`} className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Try again</Link>
      </div>
    </div>
  );
}