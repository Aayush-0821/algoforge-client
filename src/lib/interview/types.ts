export type Language = "java" | "cpp" | "python" | "javascript";
export type Mode = "practice" | "interview";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Company {
  slug: string;
  name: string;
  role: string;
  durationMins: number;
  difficulty: Difficulty;
  gradient: string;
  tagline: string;
  sections: { name: string; type: "mcq" | "coding"; count: number; marks: number }[];
  topics: string[];
}


export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface SampleTestCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface CodingQuestion {
  id: string;
  type: "coding";
  title: string;
  difficulty: Difficulty;
  marks: number;

  // Problem statement, preserving paragraph and line breaks.
  description: string[];

  // Public illustrative examples.
  examples: Example[];

  // Input/output format sections from the source question.
  inputFormat?: string;
  outputFormat?: string;

  // Constraints and judge-provided sample cases.
  constraints: string[];
  sampleTestCases?: SampleTestCase[];

  hints: string[];
  starter: Record<Language, string>;
  sampleInput: string;
}


export interface McqQuestion {
  id: string;
  type: "mcq";
  title: string;
  prompt: string;
  code?: string;
  options: string[];
  multiple: boolean;
  marks: number;
  // MOCK ONLY: move grading to the backend, never ship answers to the client.
  correct: number[];
}

export type Question = CodingQuestion | McqQuestion;

export interface CaseResult {
  input: string;
  expected: string;
  output: string;
  passed: boolean;
  timeMs: number;
}

export interface RunResult {
  status: "accepted" | "wrong_answer" | "runtime_error" | "compile_error" | "tle";
  cases: CaseResult[];
  stderr?: string;
}