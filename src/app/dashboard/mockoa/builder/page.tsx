
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createMockOAAssessment, getQuestionBank,
  publishMockOAAssessment,
  type QuestionBankItem, } from "@/src/lib/mockoa/api";

export default function MockOABuilderPage() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(90);
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(60);
  const [tier, setTier] = useState<"FREE" | "PRO" | "PREMIUM">("FREE");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [draftId, setDraftId] = useState("");

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getQuestionBank({
        search,
        companyName: company,
        difficulty,
        page,
        limit: 20,
      });

      setQuestions(result.questions);
      setCompanies(result.companies);
      setTotalPages(Math.max(1, result.totalPages));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load questions",
      );
    } finally {
      setLoading(false);
    }
  }, [search, company, difficulty, page]);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const selectedCount = selected.length;
  const marksPerQuestion = useMemo(
    () => (selectedCount > 0 ? totalMarks / selectedCount : 0),
    [selectedCount, totalMarks],
  );

  function toggleQuestion(questionId: string) {
    setSelected((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
    setNotice("");
    setDraftId("");
  }

  async function handleCreateDraft() {
    if (!title.trim()) {
      setError("Enter an assessment title.");
      return;
    }

    if (!company.trim()) {
      setError(
        "Choose a company in the filter or enter a company name in the assessment form.",
      );
      return;
    }

    if (selected.length === 0) {
      setError("Select at least one question.");
      return;
    }

    if (duration < 1 || totalMarks <= 0) {
      setError("Duration and total marks must be positive.");
      return;
    }

    if (passingMarks < 0 || passingMarks > totalMarks) {
      setError("Passing marks must be between zero and total marks.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const draft = await createMockOAAssessment({
        companyName: company,
        title: title.trim(),
        description: description.trim() || undefined,
        durationMinutes: duration,
        totalMarks,
        passingMarks,
        subscriptionTier: tier,
        questionIds: selected,
      });

      setDraftId(draft.id);
      setNotice(`Draft created: ${draft.title}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create draft",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!draftId) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const published = await publishMockOAAssessment(draftId);
      setNotice(`Published successfully: ${published.title}`);
      setDraftId("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to publish assessment",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#08090c] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard/mockoa/import"
              className="mb-3 inline-flex text-sm text-zinc-400 transition hover:text-white"
            >
              ← Back to imports
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight">
              Assessment Builder
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Assemble a company-specific mock assessment from your question bank.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs text-zinc-400">Selected questions</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {selectedCount}
            </p>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200"
          >
            {notice}
          </div>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-medium">Question bank</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Select questions across pages; your selection is preserved.
                  </p>
                </div>
                <span className="text-xs text-zinc-500">
                  Page {page} of {totalPages}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search questions..."
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
                />

                <select
                  value={company}
                  onChange={(event) => {
                    setCompany(event.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-white/10 bg-[#111216] px-3 py-2.5 text-sm outline-none focus:border-white/30"
                >
                  <option value="">All companies</option>
                  {companies.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  value={difficulty}
                  onChange={(event) => {
                    setDifficulty(event.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-white/10 bg-[#111216] px-3 py-2.5 text-sm outline-none focus:border-white/30"
                >
                  <option value="">All difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {loading ? (
                <div className="p-12 text-center text-sm text-zinc-500">
                  Loading question bank...
                </div>
              ) : questions.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="font-medium text-zinc-300">
                    No questions found
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Import questions first, or try another search or filter.
                  </p>
                </div>
              ) : (
                questions.map((question) => {
                  const checked = selected.includes(question.questionId);

                  return (
                    <label
                      key={question.questionId}
                      className={`flex cursor-pointer gap-4 p-5 transition ${
                        checked ? "bg-white/[0.06]" : "hover:bg-white/[0.025]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleQuestion(question.questionId)}
                        className="mt-1 size-4 accent-white"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-zinc-100">
                            {question.title}
                          </h3>
                          {question.difficulty && (
                            <span className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-zinc-400">
                              {question.difficulty}
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs text-zinc-500">
                          {question.companyName}
                          {question.estimatedMinutes
                            ? ` · ${question.estimatedMinutes} min`
                            : ""}
                        </p>

                        {question.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {question.tags.slice(0, 5).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-zinc-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="self-center text-xs text-zinc-500">
                        {checked ? "Selected" : "Add"}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 p-4">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </section>

          <aside className="space-y-5 xl:sticky xl:top-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <h2 className="font-medium">Assessment settings</h2>
              <p className="mt-1 text-xs text-zinc-500">
                These details will appear on the assessment.
              </p>

              <div className="mt-5 space-y-4">
                <Field label="Assessment title">
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. SDE Mock OA — Set 1"
                    className={inputClass}
                  />
                </Field>

                <Field label="Company">
                  <input
                    list="mockoa-companies"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    placeholder="e.g. Amazon"
                    className={inputClass}
                  />
                  <datalist id="mockoa-companies">
                    {companies.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </Field>

                <Field label="Description">
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={3}
                    placeholder="Optional instructions..."
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Duration (min)">
                    <input
                      type="number"
                      min={1}
                      value={duration}
                      onChange={(event) =>
                        setDuration(Number(event.target.value))
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Total marks">
                    <input
                      type="number"
                      min={1}
                      value={totalMarks}
                      onChange={(event) =>
                        setTotalMarks(Number(event.target.value))
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Passing marks">
                  <input
                    type="number"
                    min={0}
                    max={totalMarks}
                    value={passingMarks}
                    onChange={(event) =>
                      setPassingMarks(Number(event.target.value))
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Access tier">
                  <select
                    value={tier}
                    onChange={(event) =>
                      setTier(event.target.value as typeof tier)
                    }
                    className={inputClass}
                  >
                    <option value="FREE">Free</option>
                    <option value="PRO">Pro</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <h2 className="font-medium">Assessment summary</h2>

              <div className="mt-4 space-y-3 text-sm">
                <SummaryRow label="Questions" value={String(selectedCount)} />
                <SummaryRow
                  label="Duration"
                  value={`${duration || 0} minutes`}
                />
                <SummaryRow label="Total marks" value={String(totalMarks)} />
                <SummaryRow
                  label="Marks per question"
                  value={marksPerQuestion.toFixed(2)}
                />
              </div>

              <p className="mt-4 text-xs leading-5 text-zinc-500">
                Marks are currently distributed equally across selected
                questions by the backend. Individual marks can be configured
                in a later iteration.
              </p>

              <button
                type="button"
                disabled={saving || Boolean(draftId)}
                onClick={handleCreateDraft}
                className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : draftId ? "Draft created" : "Create draft"}
              </button>

              {draftId && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handlePublish}
                  className="mt-3 w-full rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/15 disabled:opacity-50"
                >
                  {saving ? "Publishing..." : "Publish assessment"}
                </button>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-xs text-zinc-400">
      <span>{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium tabular-nums text-zinc-200">{value}</span>
    </div>
  );
}
