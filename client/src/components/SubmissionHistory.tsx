import React, { useEffect, useMemo, useState } from 'react';
import { Clock, CheckCircle, XCircle, Zap } from 'lucide-react';
import { fetchMySubmissions } from '../services/api';
import { SubmissionHistory as SubmissionHistoryType } from '../types';

const SubmissionHistory: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionHistoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = import.meta.env.VITE_DEMO_USER_ID || 'demo-user';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMySubmissions(userId);
        setSubmissions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load submissions');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const stats = useMemo(() => {
    const accepted = submissions.filter((s) => s.status?.toUpperCase() === 'ACCEPTED').length;
    const failed = submissions.length - accepted;
    const avgScore = submissions.length
      ? submissions.reduce((sum, item) => sum + (item.score || 0), 0) / submissions.length
      : 0;
    return { accepted, failed, avgScore: Math.round(avgScore), total: submissions.length };
  }, [submissions]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Submission History</h1>
        <p className="text-gray-600">Track your recent submissions and progress.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Total Submissions</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Accepted</div>
          <div className="text-2xl font-semibold text-green-600 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{stats.accepted}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Failed</div>
          <div className="text-2xl font-semibold text-red-600 flex items-center space-x-2">
            <XCircle className="w-5 h-5" />
            <span>{stats.failed}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-600">Average Score</div>
          <div className="text-2xl font-semibold text-blue-600 flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>{stats.avgScore}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent submissions</h3>
          {loading && <span className="text-sm text-gray-500">Refreshing...</span>}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Problem</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Runtime</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Score</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{submission.problemTitle}</div>
                    <div className="text-xs text-gray-500">#{submission.problemId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        submission.status?.toUpperCase() === 'ACCEPTED'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {submission.runtime ? `${submission.runtime} ms` : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{Math.round(submission.score)}%</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))}

              {!loading && submissions.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                    No submissions yet. Run a problem to see it here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistory;
