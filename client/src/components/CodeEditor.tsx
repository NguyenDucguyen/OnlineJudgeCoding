import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RefreshCw, Upload } from 'lucide-react';

type SupportedLanguage = 'javascript' | 'python' | 'java' | 'cpp';

interface CodeEditorProps {
  initialCode?: string;
  language: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  onRunCode: (code: string) => void;
  onSubmitCode: (code: string) => void;
  isRunning?: boolean;
  canSubmit?: boolean;
  submitGuardMessage?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language,
  onLanguageChange,
  onRunCode,
  onSubmitCode,
  isRunning = false,
  canSubmit = true,
  submitGuardMessage,
}) => {
  const [code, setCode] = useState(initialCode || getDefaultCode(language));

  useEffect(() => {
    setCode(initialCode || getDefaultCode(language));
  }, [language, initialCode]);

  function getDefaultCode(lang: SupportedLanguage): string {
    switch (lang) {
      case 'javascript':
        return `function solution(input) {
  // Write your solution here
  return input;
}`;
      case 'python':
        return `def solution(input):
    # Write your solution here
    return input`;
      case 'java':
        return `public class Solution {
    public static String solution(String input) {
        // Write your solution here
        return input;
    }
}`;
      case 'cpp':
        return `#include <bits/stdc++.h>
using namespace std;

int main() {
    string input;
    getline(cin, input);
    cout << input;
    return 0;
}`;
      default:
        return '';
    }
  }

  const monacoLanguage = language === 'cpp' ? 'cpp' : language;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => onLanguageChange?.(e.target.value as SupportedLanguage)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onRunCode(code)}
            disabled={isRunning}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>Run Code</span>
          </button>

          <button
            onClick={() => onSubmitCode(code)}
            disabled={!canSubmit}
            className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              canSubmit
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {!canSubmit && submitGuardMessage && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 text-xs text-yellow-800 flex items-start space-x-2">
          <Upload className="w-4 h-4 mt-0.5" />
          <p>{submitGuardMessage}</p>
        </div>
      )}

      <Editor
        height="320px"
        language={monacoLanguage}
        theme="vs-light"
        value={code}
        onChange={(value) => setCode(value || '')}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;