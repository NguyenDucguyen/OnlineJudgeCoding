import React, { useEffect, useState } from 'react';
import { Play, RefreshCw, Upload } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language: string;
  onLanguageChange: (language: string) => void;
  onRunCode: (code: string) => void;
  onSubmitCode: (code: string) => void;
  isRunning?: boolean;
  isSubmitDisabled?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language,
  onLanguageChange,
  onRunCode,
  onSubmitCode,
  isRunning = false,
  isSubmitDisabled = false
}) => {
  const [code, setCode] = useState(initialCode || getDefaultCode(language));

  useEffect(() => {
    setCode(getDefaultCode(language));
  }, [language]);

  const languageOptions = [
    { value: '', label: 'Select language' },
    { value: 'javascript', label: 'JavaScript (Node.js)' },
    { value: 'python', label: 'Python 3' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  function getDefaultCode(lang: string): string {
    switch (lang) {
      case 'javascript':
        return `function solution(input) {
    // Write your solution here
    
    return result;
}`;
      case 'python':
        return `def solution(input):
    # Write your solution here
    
    return result`;
      case 'java':
        return `public class Solution {
    public static String solution(String input) {
        // Write your solution here
        
        return result;
    }
}`;
      default:
        return '';
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onRunCode(code)}
            disabled={isRunning || !language}
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
            disabled={isRunning || isSubmitDisabled || !language}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Submit</span>
          </button>
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-80 p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50"
        placeholder="Write your code here..."
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;