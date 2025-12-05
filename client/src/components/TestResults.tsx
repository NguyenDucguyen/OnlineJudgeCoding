import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestResult {
  testCase: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTime: number;
}

interface TestSummary {
  passedTestCases?: number | null;
  totalTestCases?: number | null;
  status?: string | null;
  runtime?: number | null;
}

interface TestResultsProps {
  results: TestResult[];
  summary?: TestSummary;
}

const TestResults: React.FC<TestResultsProps> = ({ results, summary }) => {
  const status = summary?.status?.toUpperCase();
  const passedCount = summary?.passedTestCases ?? results.filter((r) => r.passed).length;
  const totalCount = summary?.totalTestCases ?? results.length;
  const allPassed = status === 'ACCEPTED' || (totalCount > 0 && passedCount === totalCount);
  const runtime = summary?.runtime ?? (results.length > 0 ? results[0].executionTime : 0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  const activeResult = results[activeIndex] ?? results[0];
  const inputLines = (activeResult?.input || '').split('\n').filter(Boolean);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Sample Test Cases</p>
            <h3 className="text-lg font-semibold text-gray-900">{passedCount}/{totalCount} Passed</h3>
            <p className="text-xs text-gray-500">Showing the visible test cases that ran during your submission</p>
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
            <p className="text-green-700">You passed every sample case. The full test suite also reported all tests passed.</p>
            <p className="text-green-700 mt-1">Runtime: {runtime}ms</p>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm border transition-colors ${
                activeIndex === index
                  ? result.passed
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-red-100 text-red-800 border-red-200'
                  : result.passed
                    ? 'bg-green-50 text-green-700 border-green-100'
                    : 'bg-red-50 text-red-700 border-red-100'
              }`}
            >
              {result.passed ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Case {result.testCase}
            </button>
          ))}
        </div>

        {activeResult && (
          <div
            className={`border rounded-lg ${
              activeResult.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {activeResult.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium text-gray-900">Sample Test Case {activeResult.testCase}</span>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    activeResult.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {activeResult.passed ? 'Passed' : 'Failed'}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{activeResult.executionTime}ms</span>
              </div>
            </div>

            <div className="p-4 space-y-4 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">Input</p>
                <div className="rounded-lg border bg-white p-3 space-y-1 font-mono text-xs text-gray-800">
                  {inputLines.length > 0 ? (
                    inputLines.map((line, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400">»</span>
                        <span className="break-all">{line}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">No input provided</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeResult.passed ? (
                  <div className="col-span-1 sm:col-span-2">
                    <p className="font-medium text-gray-700 mb-2 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Output</span>
                    </p>
                    <pre className="p-3 bg-white rounded-lg border border-green-200 font-mono text-xs whitespace-pre-wrap break-all text-green-800">
                      {activeResult.expected}
                    </pre>
                    <p className="mt-1 text-xs text-green-700">Matches the expected output for this case.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium text-gray-700 mb-2">Your Output</p>
                      <pre className="p-3 bg-white rounded-lg border font-mono text-xs whitespace-pre-wrap break-all border-red-300 text-red-800">{activeResult.actual}</pre>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-2">Expected Output</p>
                      <pre className="p-3 bg-white rounded-lg border font-mono text-xs whitespace-pre-wrap break-all">{activeResult.expected}</pre>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResults;
