import { Problem, SubmissionHistory, SubmissionResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Unexpected API error');
  }
  return response.json() as Promise<T>;
}

export async function fetchProblems(): Promise<Problem[]> {
  const res = await fetch(`${API_URL}/api/problems`);
  return handleResponse<Problem[]>(res);
}

export async function fetchProblem(id: number): Promise<Problem> {
  const res = await fetch(`${API_URL}/api/problems/${id}`);
  return handleResponse<Problem>(res);
}

interface SubmitPayload {
  problemId: number;
  languageId: number;
  sourceCode: string;
  userId?: string;
}

export async function submitSolution(payload: SubmitPayload): Promise<SubmissionResponse> {
  const res = await fetch(`${API_URL}/api/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      problemId: payload.problemId,
      language_id: payload.languageId,
      source_code: payload.sourceCode,
      userId: payload.userId,
    }),
  });

  return handleResponse<SubmissionResponse>(res);
}

export async function fetchMySubmissions(userId: string): Promise<SubmissionHistory[]> {
  const res = await fetch(`${API_URL}/api/submissions/my-submissions?userId=${encodeURIComponent(userId)}`);
  return handleResponse<SubmissionHistory[]>(res);
}
