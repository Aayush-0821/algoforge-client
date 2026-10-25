
import type {
  CodingQuestion,
  Difficulty,
  Example,
  Language,
  Question,
} from "@/src/lib/interview/types";
import type {
  AssessmentDetailQuestion,
  AssessmentDetails,
} from "@/src/lib/mockoa/api";

function toDifficulty(value: string | null): Difficulty {
  switch (value?.toUpperCase()) {
    case "EASY":
      return "Easy";
    case "HARD":
      return "Hard";
    default:
      return "Medium";
  }
}

function parseValue(value: unknown): unknown {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function toText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function toExamples(value: unknown): Example[] {
  const parsed = parseValue(value);

  const items = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object"
      ? [parsed]
      : typeof parsed === "string" && parsed.trim()
        ? [{ input: parsed, output: "" }]
        : [];

  return items.flatMap((item): Example[] => {
    if (typeof item === "string") {
      return [{ input: item, output: "" }];
    }

    if (!item || typeof item !== "object") return [];

    const record = item as Record<string, unknown>;

    const input = record.input
      ?? record.stdin
      ?? record.sampleInput
      ?? record.exampleInput;

    const output = record.output
      ?? record.stdout
      ?? record.expectedOutput
      ?? record.exampleOutput;

    if (input == null && output == null) return [];

    const explanation = record.explanation;

    return [{
      input: toText(input),
      output: toText(output),
      ...(explanation != null
        ? { explanation: toText(explanation) }
        : {}),
    }];
  });
}

function toStringArray(value: unknown): string[] {
  const parsed = parseValue(value);

  if (Array.isArray(parsed)) {
    return parsed.map(toText).filter(Boolean);
  }

  if (typeof parsed === "string" && parsed.trim()) {
    return [parsed];
  }

  return [];
}


function getStarterTemplates(value: unknown): Record<Language, string> {
  const parsed = parseValue(value);

  const templates: Record<string, unknown> =
    parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};

  return {
    java: toText(templates["java"] ?? templates["Java"]),

    cpp: toText(
      templates["cpp"] ??
      templates["c++"] ??
      templates["C++"]
    ),

    python: toText(
      templates["python"] ??
      templates["py"] ??
      templates["Python"]
    ),

    javascript: toText(
      templates["javascript"] ??
      templates["js"] ??
      templates["JavaScript"] ??
      templates["node"]
    ),
  };
}


function getStatement(
  content: AssessmentDetailQuestion["content"],
): string {
  if (!content) return "";

  return toText(content.statement).trim();
}




function toCodingQuestion(
  question: AssessmentDetailQuestion,
): CodingQuestion {
  const content = question.content;

  if (!content) {
    throw new Error(
      `Question content is missing for question ${question.id}.`,
    );
  }

  const examples = toExamples(content.examples);
  const sampleTestCases = toExamples(content.sampleTestCases);
  const statement = getStatement(content);

  return {
    id: question.id,
    type: "coding",
    title: toText(content.title) || "Untitled question",
    difficulty: toDifficulty(content.difficulty),
    marks: question.marks,

    description: statement ? statement.split(/\r?\n/) : [],

    inputFormat: toText(content.inputFormat),
    outputFormat: toText(content.outputFormat),

    examples,
    sampleTestCases,
    constraints: toStringArray(content.constraints),
    hints: [],
    starter: getStarterTemplates(content.codeTemplates),

    sampleInput:
      examples[0]?.input ??
      sampleTestCases[0]?.input ??
      "",
  };
}


export function adaptAssessmentQuestions(
  assessment: AssessmentDetails,
): Question[] {
  return assessment.questions
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .flatMap((question): Question[] => {
      try {
        return [toCodingQuestion(question)];
      } catch (error) {
        console.error(
          `Unable to adapt assessment question ${question.id}:`,
          error,
        );
        return [];
      }
    });
}
