import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Trophy, Users, Clock, Target, Medal, Zap, ListChecks } from 'lucide-react';
import { Contest, Problem } from '../types';
import { fetchContests, fetchContestProblems, registerForContest } from '../services/api';
import { useAuth } from '../context/AuthContext';

const buildFallbackProblem = (id: number, title: string, difficulty: Problem['difficulty']): Problem => ({
  id,
  title,
  difficulty,
  category: 'Algorithms',
  description: 'Solve this algorithmic challenge as part of the contest lineup.',
  examples: [],
  testCases: [],
  constraints: [],
  tags: [],
  timeLimit: 1000,
  memoryLimit: 65536,
});

const fallbackContests: Contest[] = [
  {
    id: 1,
    title: 'Weekly Contest 375',
    type: 'Weekly',
    startTime: new Date().toISOString(),
    durationMinutes: 90,
    participantCount: 8500,
    prizes: ['$500', '$300', '$200'],
    difficulty: 'All Levels',
    status: 'upcoming',
    problems: [
      buildFallbackProblem(101, 'Two Sum Variations', 'Easy'),
      buildFallbackProblem(102, 'Balanced Brackets', 'Medium'),
      buildFallbackProblem(103, 'Grid Path Finder', 'Hard'),
    ],
  },
  {
    id: 2,
    title: 'Algorithm Master Challenge',
    type: 'Special',
    startTime: new Date().toISOString(),
    durationMinutes: 180,
    participantCount: 15200,
    prizes: ['$2000', '$1000', '$500'],
    difficulty: 'Advanced',
    status: 'upcoming',
    problems: [
      buildFallbackProblem(104, 'Kth Largest Stream', 'Medium'),
      buildFallbackProblem(105, 'Dynamic Island Counting', 'Hard'),
      buildFallbackProblem(106, 'Segment Tree Queries', 'Hard'),
      buildFallbackProblem(107, 'Traveling Salesman Lite', 'Hard'),
    ],
  },
  {
    id: 3,
    title: 'Weekly Contest 374',
    type: 'Weekly',
    startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 90,
    participantCount: 9200,
    difficulty: 'All Levels',
    status: 'completed',
    problems: [
      buildFallbackProblem(108, 'Palindrome Reorder', 'Easy'),
      buildFallbackProblem(109, 'Tournament Seeding', 'Medium'),
      buildFallbackProblem(110, 'Network Reliability', 'Medium'),
    ],
  },
];

const CompeteSection: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [contestProblems, setContestProblems] = useState<Record<number, Problem[]>>({});
  const [expandedContestIds, setExpandedContestIds] = useState<number[]>([]);
  const [loadingProblemsId, setLoadingProblemsId] = useState<number | null>(null);
  const [problemError, setProblemError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const loadContests = async () => {
      setLoading(true);
      try {
        const data = await fetchContests(token || undefined);
        setContests(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load contests');
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, [token]);

  const getProblemsForContest = (contest: Contest) =>
      contestProblems[contest.id] || contest.problems || [];

  const toggleContestProblems = async (contest: Contest) => {
    const isExpanded = expandedContestIds.includes(contest.id);

    if (isExpanded) {
      setExpandedContestIds((ids) => ids.filter((id) => id !== contest.id));
      return;
    }

    if (!contestProblems[contest.id]) {
      setLoadingProblemsId(contest.id);
      try {
        const problems = contest.problems?.length
            ? contest.problems
            : await fetchContestProblems(contest.id, token || undefined);
        setContestProblems((prev) => ({ ...prev, [contest.id]: problems }));
        setProblemError(null);
      } catch (err) {
        setProblemError(err instanceof Error ? err.message : 'Unable to load contest problems');
      } finally {
        setLoadingProblemsId(null);
      }
    }

    setExpandedContestIds((ids) => [...ids, contest.id]);
  };

  const contestsToDisplay = useMemo(() => (contests.length ? contests : fallbackContests), [contests]);

  const now = useMemo(() => new Date(), []);
  const upcomingContests = useMemo(
      () =>
          contestsToDisplay.filter((contest) => {
            if (contest.status?.toLowerCase() === 'upcoming') return true;
            if (contest.startTime) {
              return new Date(contest.startTime) >= now;
            }
            return false;
          }),
      [contestsToDisplay, now]
  );

  const pastContests = useMemo(
      () =>
          contestsToDisplay.filter((contest) => {
            if (contest.status?.toLowerCase() === 'completed') return true;
            if (contest.endTime) {
              return new Date(contest.endTime) < now;
            }
            return false;
          }),
      [contestsToDisplay, now]
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'completed': return 'bg-gray-50 border-gray-200 text-gray-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const totalParticipants = contestsToDisplay.reduce((sum, contest) => sum + (contest.participantCount || 0), 0);

  const topPrize = contestsToDisplay
      .flatMap((contest) => contest.prizes || [])
      .map((prize) => prize.replace(/[^0-9]/g, ''))
      .map((numeric) => Number(numeric))
      .filter((value) => !Number.isNaN(value))
      .sort((a, b) => b - a)[0];

  const handleRegister = async (contest: Contest) => {
    if (!user) {
      setRegistrationMessage('Please sign in to register for contests.');
      return;
    }

    setRegisteringId(contest.id);
    setRegistrationMessage(null);
    try {
      await registerForContest(contest.id, user.id, token || undefined);
      setRegistrationMessage(`Registered for ${contest.title}`);
    } catch (err) {
      setRegistrationMessage(
          err instanceof Error ? err.message : 'Registration failed. Please try again later.'
      );
    } finally {
      setRegisteringId(null);
    }
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Compete</h1>
          <p className="text-gray-600">Join programming contests and compete with developers worldwide</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{upcomingContests.length}</div>
                <div className="text-sm text-gray-600">Upcoming Contests</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{pastContests.length}</div>
                <div className="text-sm text-gray-600">Completed Contests</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Medal className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalParticipants.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Participants</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{topPrize ? `$${topPrize}` : 'TBD'}</div>
                <div className="text-sm text-gray-600">Top Prize</div>
              </div>
            </div>
          </div>
        </div>

        {registrationMessage && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
              {registrationMessage}
            </div>
        )}

        {problemError && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4">
              {problemError}
            </div>
        )}

        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              {error}
            </div>
        )}

        {/* Upcoming Contests */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Contests</h2>
          <div className="space-y-4">
            {upcomingContests.map((contest) => {
              const isExpanded = expandedContestIds.includes(contest.id);
              const problems = getProblemsForContest(contest);

              return (
                  <div key={contest.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{contest.title}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}>
                        {contest.type}
                      </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(contest.startTime)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{contest.durationMinutes ? `${contest.durationMinutes} minutes` : 'TBD'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{contest.participantCount?.toLocaleString() || 'N/A'} registered</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span>{contest.difficulty}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Prizes:</span>
                            <span className="ml-1 text-green-600">{contest.prizes?.join(', ') || 'TBD'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                            className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                            onClick={() => toggleContestProblems(contest)}
                            disabled={loadingProblemsId === contest.id}
                        >
                          {loadingProblemsId === contest.id
                              ? 'Loading...'
                              : isExpanded
                                  ? 'Hide Problems'
                                  : 'View Problems'}
                        </button>

                        <button
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            onClick={() => handleRegister(contest)}
                            disabled={loading || registeringId === contest.id}
                        >
                          {registeringId === contest.id ? 'Registering...' : 'Register'}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <ListChecks className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-900">Contest Problems</span>
                            <span className="text-xs text-gray-500">({problems.length || 0})</span>
                          </div>
                          {problems.length === 0 ? (
                              <p className="text-sm text-gray-600">Problems will be announced soon.</p>
                          ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {problems.map((problem) => (
                                    <div key={problem.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h4 className="font-semibold text-gray-900">{problem.title}</h4>
                                          <p className="text-xs text-gray-600 mt-1">{problem.description}</p>
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {problem.difficulty || 'Unknown'}
                              </span>
                                      </div>
                                    </div>
                                ))}
                              </div>
                          )}
                        </div>
                    )}
                  </div>
              );
            })}
          </div>
        </div>

        {/* Past Contests */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Past Contests</h2>
          <div className="space-y-4">
            {pastContests.map((contest) => {
              const isExpanded = expandedContestIds.includes(contest.id);
              const problems = getProblemsForContest(contest);

              return (
                  <div key={contest.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{contest.title}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}>
                        {contest.type}
                      </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{contest.endTime ? `Ended ${formatDate(contest.endTime)}` : `Started ${formatDate(contest.startTime)}`}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>{contest.participantCount?.toLocaleString() || 'N/A'} participants</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                            className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                            onClick={() => toggleContestProblems(contest)}
                            disabled={loadingProblemsId === contest.id}
                        >
                          {loadingProblemsId === contest.id
                              ? 'Loading...'
                              : isExpanded
                                  ? 'Hide Problems'
                                  : 'View Problems'}
                        </button>

                        <button className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                          View Results
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <ListChecks className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-900">Contest Problems</span>
                            <span className="text-xs text-gray-500">({problems.length || 0})</span>
                          </div>
                          {problems.length === 0 ? (
                              <p className="text-sm text-gray-600">Problems for this contest are not available.</p>
                          ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {problems.map((problem) => (
                                    <div key={problem.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h4 className="font-semibold text-gray-900">{problem.title}</h4>
                                          <p className="text-xs text-gray-600 mt-1">{problem.description}</p>
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {problem.difficulty || 'Unknown'}
                              </span>
                                      </div>
                                    </div>
                                ))}
                              </div>
                          )}
                        </div>
                    )}
                  </div>
              );
            })}
          </div>
        </div>

        {/* Contest Rules */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">Contest Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800">
            <div className="space-y-2">
              <div>• Register at least 10 minutes before the contest starts</div>
              <div>• You can submit multiple times during the contest</div>
              <div>• Points are awarded based on correctness and speed</div>
            </div>
            <div className="space-y-2">
              <div>• Late submissions receive penalty points</div>
              <div>• Rankings are updated in real-time</div>
              <div>• Winners are announced within 24 hours</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CompeteSection;