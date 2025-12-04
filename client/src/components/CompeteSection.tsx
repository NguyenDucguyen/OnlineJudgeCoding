import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Trophy, Users, Clock, Target, Medal, Zap } from 'lucide-react';
import { Contest } from '../types';
import { fetchContests, registerForContest } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  },
];

const CompeteSection: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [registeringId, setRegisteringId] = useState<number | null>(null);
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

  const getStatusColor = (status: string) => {
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

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Upcoming Contests */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Contests</h2>
        <div className="space-y-4">
          {upcomingContests.map((contest) => (
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
                      <span className="ml-1 text-green-600">{contest.prizes.join(', ')}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={() => handleRegister(contest)}
                  disabled={loading || registeringId === contest.id}
                >
                  {registeringId === contest.id ? 'Registering...' : 'Register'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Contests */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Past Contests</h2>
        <div className="space-y-4">
          {pastContests.map((contest) => (
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
                
                <button className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  View Results
                </button>
              </div>
            </div>
          ))}
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