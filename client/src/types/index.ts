export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  category?: string;
  description: string;
  examples?: Example[];
  testCases: TestCase[];
  constraints?: string[];
  tags?: string[];
  solved?: boolean;
  attempts?: number;
  timeLimit?: number;
  memoryLimit?: number;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface Submission {
  id: string;
  problemId: string;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  score: number;
  timestamp: Date;
}

export interface SubmissionHistory {
  id: number;
  problemId: number;
  problemTitle: string;
  status: string;
  runtime: number | null;
  memory: number | null;
  languageId: number | null;
  passedTestCases: number | null;
  totalTestCases: number | null;
  submittedAt: string;
  score: number;
  output?: string;
  errorMessage?: string;
}

export interface SubmissionResponse {
  submissionId: number;
  status: string;
  runtime: number | null;
  memory: number | null;
  output?: string;
  errorMessage?: string;
  passedTestCases: number | null;
  totalTestCases: number | null;
  score: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  score: number;
  problemsSolved: number;
  rank: number;
}