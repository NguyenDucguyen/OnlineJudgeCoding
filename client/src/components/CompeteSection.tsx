import React from 'react';
import { Calendar, Trophy, Users, Clock, Target, Medal, Zap } from 'lucide-react';

const CompeteSection: React.FC = () => {
  const upcomingContests = [
    {
      id: 1,
      title: 'Weekly Contest 375',
      type: 'Weekly',
      startTime: '2024-01-15T14:30:00Z',
      duration: '90 minutes',
      participants: '8.5K registered',
      prizes: ['$500', '$300', '$200'],
      difficulty: 'All Levels',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Algorithm Master Challenge',
      type: 'Special',
      startTime: '2024-01-18T18:00:00Z',
      duration: '3 hours',
      participants: '15.2K registered',
      prizes: ['$2000', '$1000', '$500'],
      difficulty: 'Advanced',
      status: 'upcoming'
    }
  ];

  const pastContests = [
    {
      id: 3,
      title: 'Weekly Contest 374',
      type: 'Weekly',
      endTime: '2024-01-08T16:00:00Z',
      participants: '9.2K participants',
      yourRank: 127,
      status: 'completed'
    },
    {
      id: 4,
      title: 'Data Structures Sprint',
      type: 'Sprint',
      endTime: '2024-01-05T15:00:00Z',
      participants: '5.8K participants',
      yourRank: 89,
      status: 'completed'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'completed': return 'bg-gray-50 border-gray-200 text-gray-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
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
              <div className="text-2xl font-bold text-gray-900">127</div>
              <div className="text-sm text-gray-600">Global Rank</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">2,450</div>
              <div className="text-sm text-gray-600">Contest Points</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Medal className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Contests Joined</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-600">Top 100 Finishes</div>
            </div>
          </div>
        </div>
      </div>

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
                      <span>{contest.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{contest.participants}</span>
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
                
                <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Register
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
                      <span>Ended {formatDate(contest.endTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{contest.participants}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4" />
                      <span>Your rank: #{contest.yourRank}</span>
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