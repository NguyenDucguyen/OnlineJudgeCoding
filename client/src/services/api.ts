import {
  ApiResponse,
  AuthResponse,
  CertificateAward,
  Certification,
  Contest,
  ContestRegistration,
  Problem,
  SubmissionHistory,
  SubmissionResponse,
  User,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const parseResponse = async (response: Response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error(text || 'Unexpected API error');
  }
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Unexpected API error');
  }
  return response.json() as Promise<T>;
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = (await parseResponse(response)) as ApiResponse<T>;
  if (!response.ok || data.status !== 'success') {
    throw new Error(data.message || 'Unexpected API error');
  }
  return data.data;
}

const withAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export async function fetchProblems(token?: string): Promise<Problem[]> {
  const res = await fetch(`${API_URL}/api/problems`, { headers: withAuthHeaders(token) });
  return handleResponse<Problem[]>(res);
}

export async function fetchProblem(id: number, token?: string): Promise<Problem> {
  const res = await fetch(`${API_URL}/api/problems/${id}`, { headers: withAuthHeaders(token) });
  return handleResponse<Problem>(res);
}

interface SubmitPayload {
  problemId: number;
  languageId: number;
  sourceCode: string;
  userId?: string;
  token?: string | null;
}

export async function submitSolution(payload: SubmitPayload): Promise<SubmissionResponse> {
  const res = await fetch(`${API_URL}/api/submissions`, {
    method: 'POST',
    headers: withAuthHeaders(payload.token || undefined),
    body: JSON.stringify({
      problemId: payload.problemId,
      language_id: payload.languageId,
      source_code: payload.sourceCode,
      userId: payload.userId,
    }),
  });

  return handleResponse<SubmissionResponse>(res);
}

export async function fetchMySubmissions(userId: string, token?: string | null): Promise<SubmissionHistory[]> {
  const res = await fetch(`${API_URL}/api/submissions/my-submissions?userId=${encodeURIComponent(userId)}`, {
    headers: withAuthHeaders(token || undefined),
  });
  return handleResponse<SubmissionHistory[]>(res);
}

interface AuthCredentials {
  email: string;
  password: string;
}

export async function loginUser(credentials: AuthCredentials, isAdmin = false): Promise<AuthResponse> {
  const path = isAdmin ? '/api/auth/admin/login' : '/api/auth/user/login';
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: withAuthHeaders(),
    body: JSON.stringify(credentials),
  });

  return handleApiResponse<AuthResponse>(res);
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/user/register`, {
    method: 'POST',
    headers: withAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleApiResponse<User>(res);
}

export async function fetchContests(token?: string): Promise<Contest[]> {
  const res = await fetch(`${API_URL}/api/contests`, { headers: withAuthHeaders(token) });
  return handleResponse<Contest[]>(res);
}

export async function fetchContest(contestId: number, token?: string): Promise<Contest> {
  const res = await fetch(`${API_URL}/api/contests/${contestId}`, { headers: withAuthHeaders(token) });
  return handleResponse<Contest>(res);
}

export async function fetchContestProblems(contestId: number, token?: string): Promise<Problem[]> {
  const res = await fetch(`${API_URL}/api/contests/${contestId}/problems`, { headers: withAuthHeaders(token) });
  return handleResponse<Problem[]>(res);
}

export async function registerForContest(contestId: number, userId: string, token?: string): Promise<ContestRegistration> {
  const res = await fetch(`${API_URL}/api/contests/${contestId}/register`, {
    method: 'POST',
    headers: withAuthHeaders(token),
    body: JSON.stringify({ userId }),
  });

  return handleResponse<ContestRegistration>(res);
}

export async function fetchCertifications(token?: string): Promise<Certification[]> {
  const res = await fetch(`${API_URL}/api/certifications`, { headers: withAuthHeaders(token) });
  return handleResponse<Certification[]>(res);
}

export async function fetchCertificateAwards(certificationId: number, token?: string): Promise<CertificateAward[]> {
  const res = await fetch(`${API_URL}/api/certifications/${certificationId}/awards`, {
    headers: withAuthHeaders(token),
  });

  return handleResponse<CertificateAward[]>(res);
}