export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category?: string;
  description: string;
  examples?: Example[];
  testCases?: TestCase[];
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
  id?: number;
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

export interface User {
  id: string;
  username: string;
  email: string;
  score: number;
  problemsSolved: number;
  rank: number;
}