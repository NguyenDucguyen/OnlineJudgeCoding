import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, TestTube, Code2 } from 'lucide-react';
import { Problem, SubmissionResponse } from '../types';
import CodeEditor from './CodeEditor';
import TestResults from './TestResults';
import { submitSolution } from '../services/api';

interface ProblemDetailProps {
  problem: Problem;
  onBack: () => void;
}

const ProblemDetail: React.FC<ProblemDetailProps> = ({ problem, onBack }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java' | 'cpp'>('javascript');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const languageMap = useMemo(() => ({
    javascript: { id: 63, label: 'JavaScript' },
    python: { id: 71, label: 'Python' },
    java: { id: 62, label: 'Java' },
    cpp: { id: 54, label: 'C++' },
  }), []);

  const userId = import.meta.env.VITE_DEMO_USER_ID || 'demo-user';

  const buildTestResults = (response: SubmissionResponse) => {
    const visibleCases = problem.testCases || [];
    const passedCount = response.passedTestCases ?? 0;
    return visibleCases.map((testCase, index) => ({
      testCase: index + 1,
      input: testCase.input,
      expected: testCase.expectedOutput,
      actual: response.output || testCase.expectedOutput,
      passed: index < passedCount,
      executionTime: response.runtime || 0,
    }));
  };

  const runSubmission = async (code: string) => {
    setIsRunning(true);
    setErrorMessage(null);
    try {
      const response = await submitSolution({
        problemId: Number(problem.id),
        languageId: languageMap[language].id,
        sourceCode: code,
        userId,
      });
      setTestResults(buildTestResults(response));
      setSubmissionStatus(response.status);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to submit code');
      setSubmissionStatus('Failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunCode = async (code: string) => {
    await runSubmission(code);
  };

  const handleSubmitCode = async (code: string) => {
    await runSubmission(code);
  };

  const getDifficultyColor = (difficulty: string) => {
    const normalized = difficulty?.toUpperCase();
    switch (normalized) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      case 'EASY': return 'text-green-600 bg-green-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'HARD': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problems</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Problem Description */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`inline-flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Description</span>
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`inline-flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'solution'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Solution</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'description' ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                    <span>{problem.category || 'General'}</span>
                    <span>•</span>
                    <span>{problem.attempts || 0} attempts</span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{problem.description}</p>
                </div>

                {problem.examples && problem.examples.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                    <div className="space-y-4">
                      {problem.examples.map((example, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Input:</span>
                            <code className="ml-2 text-sm bg-white px-2 py-1 rounded border">{example.input}</code>
                          </div>
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Output:</span>
                            <code className="ml-2 text-sm bg-white px-2 py-1 rounded border">{example.output}</code>
                          </div>
                          {example.explanation && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Explanation:</span>
                              <span className="ml-2 text-sm text-gray-600">{example.explanation}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {problem.constraints && problem.constraints.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                    <ul className="space-y-1">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index} className="text-sm text-gray-700">• {constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {problem.tags && problem.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Code2 className="w-12 h-12 mx-auto mb-4" />
                <p>Solution will be available after you solve this problem!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="space-y-6">
          <CodeEditor
            language={language}
            onLanguageChange={setLanguage}
            onRunCode={handleRunCode}
            onSubmitCode={handleSubmitCode}
            isRunning={isRunning}
          />

          {/* Test Results */}
          {testResults.length > 0 && (
            <TestResults results={testResults} />
          )}

          {/* Submission Status */}
          {submissionStatus && (
            <div className={`p-4 rounded-lg ${
              submissionStatus?.toUpperCase() === 'ACCEPTED'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <TestTube className={`w-5 h-5 ${
                  submissionStatus?.toUpperCase() === 'ACCEPTED' ? 'text-green-600' : 'text-red-600'
                }`} />
                <span className={`font-semibold ${
                  submissionStatus?.toUpperCase() === 'ACCEPTED' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {submissionStatus}
                </span>
              </div>
              <p className={`mt-1 text-sm ${
                submissionStatus?.toUpperCase() === 'ACCEPTED' ? 'text-green-700' : 'text-red-700'
              }`}>
                {submissionStatus?.toUpperCase() === 'ACCEPTED'
                  ? 'Congratulations! Your solution passed all test cases.'
                  : errorMessage || 'Your solution failed some test cases. Please review and try again.'}
              </p>
            </div>
          )}

          {errorMessage && !submissionStatus && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;