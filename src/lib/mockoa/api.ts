
import { authenticatedFetch } from "@/src/lib/api/authenticated-fetch";

export type ImportIssue = {
  index: number;
  title?: string;
  field: string;
  message: string;
};

export type ImportPreview = {
  total: number;
  valid: number;
  invalid: number;
  duplicateInUpload: number;
  issues: ImportIssue[];
  preview: Array<{
    index: number;
    companyName: string;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD" | null;
    tags: string[];
    sourceUrl: string | null;
    valid: boolean;
  }>;
};

export type ImportResult = {
  batchId: string;
  status: "COMPLETED" | "FAILED";
  totalRecords: number;
  insertedRecords: number;
  skippedRecords: number;
  invalidRecords: number;
  duplicateRecords: number;
  issues: ImportIssue[];
};

export type ImportHistoryItem = {
  batchId: string;
  status: string;
  sourceName: string | null;
  companyName: string | null;
  totalRecords: number;
  insertedRecords: number;
  skippedRecords: number;
  invalidRecords: number;
  duplicateRecords: number;
  issues: unknown;
  createdByEmail: string;
  createdAt: string;
  completedAt: string | null;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type QuestionImportPayload = {
  companyName?: string;
  sourceName?: string;
  records?: unknown[];
  csv?: string;
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await authenticatedFetch(endpoint, {
    ...options,
    cache: "no-store",
  });

  const body = (await response.json().catch(() => ({}))) as Partial<
    ApiResponse<T>
  > & { message?: string };

  if (!response.ok || body.success === false) {
    throw new Error(
      body.message ?? `Request failed with status ${response.status}`,
    );
  }

  return body.data as T;
}

export function previewQuestionImport(
  payload: QuestionImportPayload,
): Promise<ImportPreview> {
  return request<ImportPreview>("/api/mockoa/import/preview", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function importQuestions(
  payload: QuestionImportPayload,
): Promise<ImportResult> {
  return request<ImportResult>("/api/mockoa/import", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getImportHistory(
  limit = 20,
): Promise<ImportHistoryItem[]> {
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 100);

  return request<ImportHistoryItem[]>(
    `/api/mockoa/import/history?limit=${safeLimit}`,
  );
}


export type CompanyAssessmentQuestion = {
  id: string;
  documentId: string;
  marks: number;
  negativeMarks: number;
  displayOrder: number;
  estimatedMinutes: number | null;
};

export type CompanyAssessment = {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  passingMarks: number | null;
  subscriptionTier: string;
  isPublished: boolean;
  questions: CompanyAssessmentQuestion[];
};

export type CompanyAssessmentsResponse = {
  company: {
    id: string;
    name: string;
  } | null;
  assessments: CompanyAssessment[];
};

export function getCompanyAssessments(
  companySlug: string,
): Promise<CompanyAssessmentsResponse> {
  const safeSlug = encodeURIComponent(companySlug.trim());

  return request(
    `/api/mockoa/companies/${safeSlug}/assessments`,
  );
}

export type AssessmentQuestionContent = {
  title: string;
  statement: string;
  inputFormat: string | null;
  outputFormat: string | null;
  constraints: string[];
  examples: unknown;
  explanation: string | null;
  codeTemplates: unknown;
  sampleTestCases: unknown;
  difficulty: "EASY" | "MEDIUM" | "HARD" | null;
  tags: string[];
  estimatedMinutes: number | null;
};

export type AssessmentDetailQuestion = {
  id: string;
  marks: number;
  negativeMarks: number;
  displayOrder: number;
  estimatedMinutes: number | null;
  content: AssessmentQuestionContent | null;
};

export type AssessmentDetails = {
  id: string;
  title: string;
  description: string | null;
  company: string;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  passingMarks: number | null;
  subscriptionTier: string;
  questions: AssessmentDetailQuestion[];
};

export function getAssessmentDetails(
  assessmentId: string
): Promise<AssessmentDetails> {
  const safeId = encodeURIComponent(assessmentId.trim());

  if (!safeId) {
    throw new Error("Assessment ID is required.");
  }

  return request(`/api/mockoa/assessments/${safeId}`);
}

export type QuestionBankItem = {
  id: string;
  questionId: string;
  companyName: string;
  title: string;
  difficulty: string | null;
  tags: string[];
  sourceUrl: string | null;
  estimatedMinutes: number | null;
  importedAt: string;
};

export type QuestionBankResponse = {
  questions: QuestionBankItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  companies: string[];
};

export type CreateMockOAAssessmentInput = {
  companyName: string;
  title: string;
  description?: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks?: number;
  subscriptionTier?: "FREE" | "PRO" | "PREMIUM";
  questionIds: string[];
};

export type MockOAAssessmentDraft = {
  id: string;
  title: string;
  totalQuestions: number;
  isPublished: boolean;
};

export async function getQuestionBank(params: {
  search?: string;
  companyName?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
} = {}): Promise<QuestionBankResponse> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.companyName) query.set("companyName", params.companyName);
  if (params.difficulty) query.set("difficulty", params.difficulty);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const suffix = query.toString();
  const response = await authenticatedFetch(
    `/api/mockoa/admin/question-bank${suffix ? `?${suffix}` : ""}`,
  );

  const result = await response.json();

  if (!response.ok || result.success !== true) {
    throw new Error(result.message ?? "Failed to load question bank");
  }

  return result.data as QuestionBankResponse;
}

export async function createMockOAAssessment(
  input: CreateMockOAAssessmentInput,
): Promise<MockOAAssessmentDraft> {
  const response = await authenticatedFetch("/api/mockoa/admin/assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const result = await response.json();

  if (!response.ok || result.success !== true) {
    throw new Error(result.message ?? "Failed to create assessment");
  }

  return result.data as MockOAAssessmentDraft;
}

export async function publishMockOAAssessment(
  assessmentId: string,
): Promise<MockOAAssessmentDraft> {
  const response = await authenticatedFetch(
    `/api/mockoa/admin/assessments/${encodeURIComponent(assessmentId)}/publish`,
    { method: "POST" },
  );

  const result = await response.json();

  if (!response.ok || result.success !== true) {
    throw new Error(result.message ?? "Failed to publish assessment");
  }

  return result.data as MockOAAssessmentDraft;
}
