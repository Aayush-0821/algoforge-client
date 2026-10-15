import type { Language, RunResult } from "./types";

// TODO: replace stubs with calls to the backend repo.
// const API = process.env.NEXT_PUBLIC_API_URL;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function runCode(p: {
  questionId: string;
  language: Language;
  code: string;
  stdin: string;
}): Promise<RunResult> {
  await wait(900);
  return { status: "accepted", cases: [{ input: p.stdin, expected: "—", output: "—", passed: true, timeMs: 12 }] };
}

export async function submitCode(p: {
  questionId: string;
  language: Language;
  code: string;
}): Promise<RunResult> {
  await wait(1500);
  return {
    status: "accepted",
    cases: [1, 2, 3, 4, 5].map((i) => ({ input: `Hidden case ${i}`, expected: "—", output: "—", passed: true, timeMs: 10 + i })),
  };
}