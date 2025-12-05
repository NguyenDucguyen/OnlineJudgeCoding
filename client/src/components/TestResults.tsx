import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestResult {
  testCase: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTime: number;
}

interface TestResultsProps {
  results: TestResult[];
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Sample Test Cases</p>
            <h3 className="text-lg font-semibold text-gray-900">{passedCount}/{totalCount} Passed</h3>
          </div>
          {allPassed ? (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              All samples passed
            </div>
          ) : (
            <div className="text-sm text-gray-600">Keep iterating to pass all samples</div>
          )}
        </div>
      </div>

      {allPassed && (
        <div className="px-4 py-3 bg-green-50 border-b border-green-100 text-green-800 text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Congratulations!</p>
            <p className="text-green-700">You passed every sample case. Submit to run the full test suite.</p>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`border rounded-lg ${
                result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium text-gray-900">Sample Test case {result.testCase - 1}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{result.executionTime}ms</span>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Input (stdin)</p>
                  <pre className="mt-1 p-2 bg-white rounded border font-mono text-xs whitespace-pre-wrap break-all">{result.input}</pre>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Your Output (stdout)</p>
                  <pre className={`mt-1 p-2 bg-white rounded border font-mono text-xs whitespace-pre-wrap break-all ${
                    !result.passed ? 'border-red-300' : ''
                  }`}>{result.actual}</pre>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Expected Output</p>
                  <pre className="mt-1 p-2 bg-white rounded border font-mono text-xs whitespace-pre-wrap break-all">{result.expected}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestResults;