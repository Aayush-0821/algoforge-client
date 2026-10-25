
"use client";

import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileJson,
  FileSpreadsheet,
  History,
  LoaderCircle,
  RefreshCw,
  Upload,
} from "lucide-react";
import {
  getImportHistory,
  importQuestions,
  previewQuestionImport,
  type ImportHistoryItem,
  type ImportPreview,
  type ImportResult,
  type QuestionImportPayload,
} from "@/src/lib/mockoa/api";

type ParsedUpload = {
  payload: QuestionImportPayload;
  fileName: string;
};

function parseUpload(text: string, fileName: string): QuestionImportPayload {
  const isCsv = fileName.toLowerCase().endsWith(".csv");

  if (isCsv) {
    return { csv: text, sourceName: fileName };
  }

  const parsed: unknown = JSON.parse(text);

  if (Array.isArray(parsed)) {
    return { records: parsed, sourceName: fileName };
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("The JSON file must contain an array or an object.");
  }

  const data = parsed as Record<string, unknown>;
  const records = data.records ?? data.questions ?? data.data;

  if (!Array.isArray(records)) {
    throw new Error(
      'Could not find a question array. Use a JSON array or an object containing "records", "questions", or "data".',
    );
  }

  return {
    ...data,
    records,
    sourceName: fileName,
  } as QuestionImportPayload;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const good = status === "COMPLETED";
  const failed = status === "FAILED";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        good
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
          : failed
            ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
            : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default function MockOAImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [companyName, setCompanyName] = useState("");
  const [upload, setUpload] = useState<ParsedUpload | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [history, setHistory] = useState<ImportHistoryItem[]>([]);
  const [lastImport, setLastImport] = useState<ImportResult | null>(null);

  const [loadingFile, setLoadingFile] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const payloadForRequest = useCallback((): QuestionImportPayload | null => {
    if (!upload) return null;

    return {
      ...upload.payload,
      ...(companyName.trim()
        ? { companyName: companyName.trim() }
        : {}),
    };
  }, [upload, companyName]);

  const refreshHistory = useCallback(async () => {
    setLoadingHistory(true);

    try {
      const batches = await getImportHistory(50);
      setHistory(batches);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load import history.",
      );
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  async function handleFile(file?: File) {
    if (!file) return;

    setLoadingFile(true);
    setError("");
    setNotice("");
    setPreview(null);
    setLastImport(null);

    try {
      const isJson = file.name.toLowerCase().endsWith(".json");
      const isCsv = file.name.toLowerCase().endsWith(".csv");

      if (!isJson && !isCsv) {
        throw new Error("Choose a .json or .csv file.");
      }

      const content = await file.text();
      const payload = parseUpload(content, file.name);

      setUpload({ payload, fileName: file.name });

      const embeddedCompany =
        typeof payload.companyName === "string"
          ? payload.companyName
          : "";

      setCompanyName(embeddedCompany);
      setNotice(`${file.name} loaded. Generate a preview before importing.`);
    } catch (err) {
      setUpload(null);
      setError(
        err instanceof Error ? err.message : "Could not read this file.",
      );
    } finally {
      setLoadingFile(false);
    }
  }

  async function handlePreview() {
    const payload = payloadForRequest();
    if (!payload) {
      setError("Choose a JSON or CSV file first.");
      return;
    }

    setPreviewing(true);
    setError("");
    setNotice("");
    setLastImport(null);

    try {
      const result = await previewQuestionImport(payload);
      setPreview(result);
      setNotice("Preview generated. Review the records before importing.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Preview request failed.",
      );
    } finally {
      setPreviewing(false);
    }
  }

  async function handleImport() {
    const payload = payloadForRequest();

    if (!payload || !preview) {
      setError("Generate a preview before importing.");
      return;
    }

    if (preview.valid === 0) {
      setError("There are no valid records to import.");
      return;
    }

    setImporting(true);
    setError("");
    setNotice("");
    setLastImport(null);

    try {
      const result = await importQuestions(payload);
      setLastImport(result);
      setNotice("Import processing finished. Review the counts below.");
      await refreshHistory();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Question import failed.",
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-1 py-5 text-zinc-900 dark:text-zinc-100">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            AlgoForge · Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Question bank
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Upload company question datasets, validate the records, import
            new questions, and review previous import batches.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refreshHistory()}
          disabled={loadingHistory}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium transition hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:self-auto"
        >
          {loadingHistory ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh history
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {notice && !error && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{notice}</p>
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Upload dataset</h2>
              <p className="text-sm text-zinc-500">
                JSON or CSV question bank
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loadingFile}
            className="mt-6 flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-5 text-center transition hover:border-orange-400 hover:bg-orange-50/50 disabled:opacity-50 dark:border-white/15 dark:bg-black/20 dark:hover:border-orange-400/60 dark:hover:bg-orange-500/5"
          >
            {loadingFile ? (
              <LoaderCircle className="h-8 w-8 animate-spin text-orange-500" />
            ) : upload?.fileName.endsWith(".csv") ? (
              <FileSpreadsheet className="h-8 w-8 text-orange-500" />
            ) : (
              <FileJson className="h-8 w-8 text-orange-500" />
            )}

            <span className="mt-3 text-sm font-semibold">
              {upload ? upload.fileName : "Choose a dataset"}
            </span>
            <span className="mt-1 text-xs text-zinc-500">
              Select a .json or .csv file from your computer
            </span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".json,.csv,application/json,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              void handleFile(file);
              event.currentTarget.value = "";
            }}
          />

          <label className="mt-5 block text-sm font-medium">
            Default company name
            <span className="ml-2 font-normal text-zinc-500">
              Optional if every record includes it
            </span>
          </label>

          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="e.g. Amazon"
            className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 dark:border-white/10 dark:bg-black/20"
          />

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handlePreview()}
              disabled={!upload || loadingFile || previewing || importing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {previewing && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}
              Generate preview
            </button>

            <button
              type="button"
              onClick={() => void handleImport()}
              disabled={
                !preview ||
                preview.valid === 0 ||
                importing ||
                previewing
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {importing && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}
              Import questions
            </button>
          </div>

          <p className="mt-4 text-xs leading-5 text-zinc-500">
            Preview validates the upload without importing it. Importing saves
            valid new records and skips existing duplicates.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Validation summary</h2>
              <p className="text-sm text-zinc-500">
                {preview ? "Latest preview results" : "Waiting for a preview"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Stat label="Total records" value={preview?.total ?? "—"} />
            <Stat label="Valid records" value={preview?.valid ?? "—"} />
            <Stat label="Invalid records" value={preview?.invalid ?? "—"} />
            <Stat
              label="Upload duplicates"
              value={preview?.duplicateInUpload ?? "—"}
            />
          </div>

          {lastImport && (
            <div className="mt-5 border-t border-zinc-200 pt-5 dark:border-white/10">
              <p className="text-sm font-semibold">Latest import result</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Stat label="Inserted" value={lastImport.insertedRecords} />
                <Stat label="Skipped" value={lastImport.skippedRecords} />
                <Stat label="Invalid" value={lastImport.invalidRecords} />
                <Stat label="Duplicates" value={lastImport.duplicateRecords} />
              </div>
              <p className="mt-3 break-all text-xs text-zinc-500">
                Batch ID: {lastImport.batchId}
              </p>
            </div>
          )}
        </div>
      </section>

      {preview && (
        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
          <div className="flex flex-col gap-2 border-b border-zinc-200 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold">Record preview</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Review the server's validation output before importing.
              </p>
            </div>
            <span className="text-xs text-zinc-500">
              Showing {preview.preview.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-black/20">
                <tr>
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-5 py-3 font-medium">Question</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Difficulty</th>
                  <th className="px-5 py-3 font-medium">Source URL</th>
                  <th className="px-5 py-3 font-medium">Validation</th>
                </tr>
              </thead>
              <tbody>
                {preview.preview.map((item) => (
                  <tr
                    key={`${item.index}-${item.title}`}
                    className="border-t border-zinc-100 dark:border-white/5"
                  >
                    <td className="px-5 py-4 text-zinc-500">{item.index + 1}</td>
                    <td className="max-w-xs px-5 py-4 font-medium">
                      {item.title}
                      {item.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">{item.companyName}</td>
                    <td className="px-5 py-4">
                      {item.difficulty ?? "—"}
                    </td>
                    <td className="max-w-[180px] truncate px-5 py-4 text-zinc-500">
                      {item.sourceUrl || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.valid
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                        }`}
                      >
                        {item.valid ? "Valid" : "Invalid"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {preview.issues.length > 0 && (
            <div className="border-t border-zinc-200 p-5 dark:border-white/10 sm:p-6">
              <h3 className="font-semibold">
                Validation issues ({preview.issues.length})
              </h3>
              <ul className="mt-3 space-y-2">
                {preview.issues.map((issue, index) => (
                  <li
                    key={`${issue.index}-${issue.field}-${index}`}
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-500/10 dark:text-red-300"
                  >
                    <span className="font-medium">
                      Record {issue.index + 1}
                      {issue.title ? ` · ${issue.title}` : ""}
                      {" · "}
                      {issue.field}
                    </span>
                    <p className="mt-1">{issue.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/10">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Import history</h2>
              <p className="text-sm text-zinc-500">
                Recent import batches and processing counts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void refreshHistory()}
            disabled={loadingHistory}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            {loadingHistory ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Load history
          </button>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <Clock3 className="h-8 w-8 text-zinc-400" />
            <p className="mt-3 text-sm font-medium">No history loaded</p>
            <p className="mt-1 text-xs text-zinc-500">
              Load history to see previously processed batches.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-black/20">
                <tr>
                  <th className="px-5 py-3 font-medium">Batch</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Inserted</th>
                  <th className="px-5 py-3 font-medium">Skipped</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.batchId}
                    className="border-t border-zinc-100 dark:border-white/5"
                  >
                    <td className="px-5 py-4 font-mono text-xs">
                      {item.batchId.slice(0, 12)}…
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{item.sourceName || "Upload"}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {item.companyName || "Multiple / unspecified"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={item.status} />
                    </td>
                    <td className="px-5 py-4">{item.totalRecords}</td>
                    <td className="px-5 py-4 text-emerald-600 dark:text-emerald-400">
                      {item.insertedRecords}
                    </td>
                    <td className="px-5 py-4">{item.skippedRecords}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-zinc-500">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
