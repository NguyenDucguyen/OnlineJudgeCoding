export interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface Judge0Status {
  id: number;
  description: string;
}

export interface Judge0SubmissionResponse {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  memory?: number | null;
  time?: string | number | null;
  status?: Judge0Status;
}

const DEFAULT_BASE_URL = 'http://localhost:2358';
const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_API_URL || DEFAULT_BASE_URL;

export async function submitToJudge0(payload: Judge0SubmissionRequest): Promise<Judge0SubmissionResponse> {
  const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Failed to submit code to Judge0');
  }

  return response.json();
}
