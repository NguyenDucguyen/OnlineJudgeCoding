export interface Judge0Submission {
  token?: string;
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  status?: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
}

export interface SubmissionPayload {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export const LANGUAGE_ID_MAP: Record<string, number> = {
  javascript: 63, // JavaScript (Node.js)
  python: 71, // Python (3.11)
  java: 62, // Java (OpenJDK 17)
  cpp: 54 // C++ (GCC 9.2.0)
};

const BASE_URL = import.meta.env.VITE_JUDGE0_BASE_URL || 'https://judge0-ce.p.rapidapi.com';
const API_KEY = import.meta.env.VITE_JUDGE0_API_KEY;
const API_HOST = import.meta.env.VITE_JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

const buildHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (API_KEY) {
    headers['X-RapidAPI-Key'] = API_KEY;
  }

  if (API_HOST) {
    headers['X-RapidAPI-Host'] = API_HOST;
  }

  return headers;
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const submitToJudge0 = async (payload: SubmissionPayload, waitForCompletion = true): Promise<Judge0Submission> => {
  const submissionResponse = await fetch(
    `${BASE_URL}/submissions?base64_encoded=false&wait=${waitForCompletion}`,
    {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(payload)
    }
  );

  if (!submissionResponse.ok) {
    throw new Error('Failed to create submission');
  }

  const submissionData: Judge0Submission = await submissionResponse.json();

  if (waitForCompletion && submissionData.status && submissionData.status.id > 2) {
    return submissionData;
  }

  if (!submissionData.token) {
    throw new Error('Submission token not received');
  }

  return pollSubmission(submissionData.token);
};

export const pollSubmission = async (token: string, maxAttempts = 10, delay = 1500): Promise<Judge0Submission> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const resultResponse = await fetch(
      `${BASE_URL}/submissions/${token}?base64_encoded=false`,
      {
        headers: buildHeaders()
      }
    );

    if (!resultResponse.ok) {
      throw new Error('Failed to fetch submission result');
    }

    const resultData: Judge0Submission = await resultResponse.json();

    if (resultData.status && resultData.status.id > 2) {
      return resultData;
    }

    await wait(delay);
  }

  throw new Error('Timed out waiting for submission result');
};
