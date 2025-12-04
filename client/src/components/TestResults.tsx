import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestResult {
  testCase: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTime: number;
  hidden?: boolean;
}

interface TestResultsProps {
  results: TestResult[];
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
          <span className="text-sm text-gray-600">
            {passedCount}/{totalCount} passed
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${
                result.passed
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium text-gray-900">
                    Test Case {result.testCase}
                  </span>
                  {result.hidden && (
                    <span className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded-full">Hidden</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{result.executionTime}ms</span>
                </div>
              </div>

              {result.hidden ? (
                <p className="text-sm text-gray-700">Hidden test case - {result.passed ? 'Passed' : 'Failed'}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Input:</span>
                    <div className="mt-1 p-2 bg-white rounded border font-mono text-xs break-all">
                      {result.input}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Expected:</span>
                    <div className="mt-1 p-2 bg-white rounded border font-mono text-xs break-all">
                      {result.expected}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Your Output:</span>
                    <div className={`mt-1 p-2 bg-white rounded border font-mono text-xs break-all ${
                      !result.passed ? 'border-red-300' : ''
                    }`}>
                      {result.actual}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestResults;
