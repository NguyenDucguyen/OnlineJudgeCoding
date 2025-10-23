import React, { useState } from 'react';
import { ArrowLeft, BookOpen, TestTube, Code2 } from 'lucide-react';
import { Problem } from '../types';
import CodeEditor from './CodeEditor';
import TestResults from './TestResults';

interface ProblemDetailProps {
  problem: Problem;
  onBack: () => void;
}

const ProblemDetail: React.FC<ProblemDetailProps> = ({ problem, onBack }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const handleRunCode = async (code: string) => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      const results = problem.testCases.filter(tc => !tc.hidden).map((testCase, index) => ({
        testCase: index + 1,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: testCase.expectedOutput, // Mock: assume correct for demo
        passed: Math.random() > 0.3, // Random pass/fail for demo
        executionTime: Math.floor(Math.random() * 100) + 10
      }));
      setTestResults(results);
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmitCode = async (code: string) => {
    setIsRunning(true);
    // Simulate submission
    setTimeout(() => {
      const passed = Math.random() > 0.4;
      setSubmissionStatus(passed ? 'Accepted' : 'Wrong Answer');
      setIsRunning(false);
    }, 3000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
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
                    <span>{problem.category}</span>
                    <span>•</span>
                    <span>{problem.attempts} attempts</span>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{problem.description}</p>
                </div>

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

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                  <ul className="space-y-1">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index} className="text-sm text-gray-700">• {constraint}</li>
                    ))}
                  </ul>
                </div>

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
            language="javascript"
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
              submissionStatus === 'Accepted' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <TestTube className={`w-5 h-5 ${
                  submissionStatus === 'Accepted' ? 'text-green-600' : 'text-red-600'
                }`} />
                <span className={`font-semibold ${
                  submissionStatus === 'Accepted' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {submissionStatus}
                </span>
              </div>
              <p className={`mt-1 text-sm ${
                submissionStatus === 'Accepted' ? 'text-green-700' : 'text-red-700'
              }`}>
                {submissionStatus === 'Accepted' 
                  ? 'Congratulations! Your solution passed all test cases.'
                  : 'Your solution failed some test cases. Please review and try again.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;