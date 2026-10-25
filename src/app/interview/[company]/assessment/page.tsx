"use client";

// Only the page shell and footer are restyled here. AssessmentTopBar,
// CodingWorkSpace, McqPane, CameraPip, ProctorOverlay and ConfirmDialog
// still need the same treatment (I haven't seen their code).
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { getCompany } from "@/src/lib/interview/data";
import {
  getAssessmentDetails,
  type AssessmentDetails,
} from "@/src/lib/mockoa/api";
import type { Question } from "@/src/lib/interview/types";
import { useSearchParams } from "next/navigation";
import { useInterview } from "@/src/lib/interview/store";
import { useCountdown } from "@/src/lib/interview/useCountdown";
import { MAX_VIOLATIONS, useProctoring } from "@/src/lib/interview/useProctoring";
import AssessmentTopBar from "@/src/components/interview/AssessmentTopBar";
import CodingWorkspace from "@/src/components/interview/CodingWorkSpace";
import McqPane from "@/src/components/interview/McqPane";
import CameraPip from "@/src/components/interview/CameraPip";
import ProctorOverlay from "@/src/components/interview/ProctorOverlay";
import ConfirmDialog from "@/src/components/interview/ConfirmDialog";
import {
  INK,
  LIME,
  fMono,
  fontVars,
  glass,
  skyApp,
} from "@/src/components/interview/theme";
import { adaptAssessmentQuestions } from "@/src/lib/mockoa/question-adapter";

export default function AssessmentPage({ params }: { params: Promise<{ company: string }> }) {
  const { company: slug } = use(params);
  const company = getCompany(slug);
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");

  const { state, finish, toggleFlag } = useInterview();

  const [assessment, setAssessment] = useState<AssessmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!assessmentId) {
      setLoadError("Assessment ID is missing. Please select an assessment again.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadAssessment() {
      try {
        setLoading(true);
        setLoadError(null);

        const id = assessmentId;
if (!id) return;

const data = await getAssessmentDetails(id);

        if (!cancelled) {
          setAssessment(data);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load this assessment."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAssessment();

    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  const questions = useMemo(() => {
  if (!assessment) return [];

  try {
    return adaptAssessmentQuestions(assessment);
  } catch (error) {
    console.error("Unable to prepare assessment questions:", error);
    return [];
  }
}, [assessment]);
  const isInterview = state.mode === "interview";
  const { warning, resume } = useProctoring(isInterview && !state.finishedAt);

  const submitAll = useCallback(() => {
    finish();
    router.replace(`/interview/${slug}/result`);
  }, [finish, router, slug]);

  const msLeft = useCountdown(state.endsAt, state.pausedLeftMs, submitAll);

  useEffect(() => {
    if (!company || !state.startedAt || state.company !== slug) router.replace(`/interview/${slug}`);
  }, [company, state.startedAt, state.company, slug, router]);

  useEffect(() => {
    if (isInterview && state.violations >= MAX_VIOLATIONS) submitAll();
  }, [isInterview, state.violations, submitAll]);

  if (!company || !state.startedAt) return null;

if (loading) {
  return (
    <div
      className={`${fontVars} flex h-dvh items-center justify-center`}
      style={{ ...skyApp, color: INK }}
    >
      Loading assessment...
    </div>
  );
}

if (loadError || !assessment) {
  return (
    <div
      className={`${fontVars} flex h-dvh flex-col items-center justify-center gap-4 p-6`}
      style={{ ...skyApp, color: INK }}
    >
      <p>{loadError ?? "Assessment could not be loaded."}</p>
      <button
        onClick={() => router.replace(`/interview/${slug}`)}
        className="rounded-full px-5 py-3 text-white"
        style={{ backgroundColor: INK }}
      >
        Back to assessments
      </button>
    </div>
  );
}

if (questions.length === 0) {
  return (
    <div
      className={`${fontVars} flex h-dvh flex-col items-center justify-center gap-4 p-6`}
      style={{ ...skyApp, color: INK }}
    >
      <p>This assessment has no usable questions yet.</p>
      <button
        onClick={() => router.replace(`/interview/${slug}`)}
        className="rounded-full px-5 py-3 text-white"
        style={{ backgroundColor: INK }}
      >
        Back to assessments
      </button>
    </div>
  );
}

const q = questions[index];
  const last = index === questions.length - 1;
  const flagged = state.flagged[q.id];

  return (
    <div
      className={`${fontVars} flex h-dvh flex-col gap-3 overflow-hidden p-3`}
      style={{ ...skyApp, color: INK }}
    >
      <AssessmentTopBar
        companyName={assessment.company}
        questions={questions}
        index={index}
        onSelect={setIndex}
        msLeft={msLeft}
        interview={isInterview}
        onFinish={() => setConfirm(true)}
      />

      <main className="min-h-0 flex-1">
        {q.type === "coding" ? (
          <CodingWorkspace key={q.id} question={q} practice={!isInterview} />
        ) : (
          <McqPane key={q.id} question={q} number={index + 1} />
        )}
      </main>

      <footer
        className={`flex h-16 shrink-0 items-center justify-between rounded-[26px] px-5 ${glass}`}
      >
        <button
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
          className={`flex items-center gap-1.5 rounded-full border border-white/80 bg-white/50 px-5 py-2.5 text-[13px] transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 disabled:opacity-30 ${fMono}`}
        >
          <ChevronLeft size={15} /> Previous
        </button>

        <button
          onClick={() => toggleFlag(q.id)}
          aria-pressed={!!flagged}
          className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 ${fMono} ${flagged
              ? "border-transparent text-slate-900"
              : "border-white/80 bg-white/50 text-slate-700 hover:bg-white/80"
            }`}
          style={flagged ? { backgroundColor: LIME } : undefined}
        >
          <Flag size={14} /> {flagged ? "Marked for review" : "Mark for review"}
        </button>

        <button
          onClick={() => (last ? setConfirm(true) : setIndex(index + 1))}
          className={`flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${fMono}`}
          style={{ backgroundColor: INK }}
        >
          {last ? "Finish" : "Next"} <ChevronRight size={15} />
        </button>
      </footer>

      {isInterview && <CameraPip />}
      {isInterview && warning && (
        <ProctorOverlay reason={warning} violations={state.violations} max={MAX_VIOLATIONS} onResume={resume} />
      )}
      {confirm && (
        <ConfirmDialog questions={questions} onCancel={() => setConfirm(false)} onConfirm={submitAll} />
      )}
    </div>
  );
}