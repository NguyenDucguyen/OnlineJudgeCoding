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

export interface Contest {
  id: number;
  title: string;
  type: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  participantCount?: number;
  difficulty?: string;
  status?: string;
  prizes?: string[];
}

export interface ContestRegistration {
  id: number;
  contest?: Contest;
  userId: string;
  registeredAt?: string;
}

export interface Certification {
  id: number;
  title: string;
  description: string;
  durationMinutes?: number;
  questionCount?: number;
  participantCount?: number;
  difficulty?: string;
  passingScore?: number;
}

export interface CertificateAward {
  id: number;
  certification?: Certification;
  userId: string;
  score?: number;
  passed?: boolean;
  issuedAt?: string;
  verificationCode?: string;
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
  role?: string;
  avatar?: string;
  score?: number;
  problemsSolved?: number;
  rank?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}