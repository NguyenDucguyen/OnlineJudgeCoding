import React from 'react';
import { Bot, Loader2, Sparkles, TestTube } from 'lucide-react';
import { AiFeedback } from '../types';

interface AiFeedbackPanelProps {
  feedback?: AiFeedback | null;
  isLoading?: boolean;
  error?: string | null;
  submissionId?: number | null;
  submissionStatus?: string | null;
  onRequest: () => void;
}

const AiFeedbackPanel: React.FC<AiFeedbackPanelProps> = ({
  feedback,
  isLoading,
  error,
  submissionId,
  submissionStatus,
  onRequest,
}) => {
  const disabled = isLoading || !submissionId;
  const statusUpper = submissionStatus?.toUpperCase();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Code feedback</p>
            <p className="text-xs text-gray-500">Giải thích lỗi và gợi ý cải thiện sau lần nộp mới nhất</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRequest}
          disabled={disabled}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
            disabled
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          {submissionId ? 'Nhận feedback' : 'Get Feeeback'}
        </button>
      </div>

      <div className="p-4 space-y-3">
        {!submissionId && (
          <p className="text-sm text-gray-600">Chạy và nộp code để lấy giải thích</p>
        )}

        {submissionStatus && submissionId && (
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
              statusUpper === 'ACCEPTED'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
            }`}
          >
            <TestTube className="w-4 h-4 mr-2" />
            Lần nộp #{submissionId}: {submissionStatus}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {feedback && (
          <div className="mt-2 border border-indigo-100 bg-indigo-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{feedback.problemTitle || 'Problem'}</span>
              <span className="font-medium text-indigo-700">{feedback.model || 'GPT-4o'}</span>
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{feedback.feedback}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiFeedbackPanel;
