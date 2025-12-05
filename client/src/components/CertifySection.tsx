import React, { useEffect, useMemo, useState } from 'react';
import { Award, Clock, Users, ArrowRight } from 'lucide-react';
import { Certification } from '../types';
import { fetchCertifications } from '../services/api';
import { useAuth } from '../context/AuthContext';

const fallbackCertifications: Certification[] = [
  {
    id: 1,
    title: 'JavaScript (Basic)',
    description: 'Test your basic JavaScript skills including variables, functions, and control structures',
    durationMinutes: 45,
    questionCount: 15,
    participantCount: 12500,
    difficulty: 'Basic',
    passingScore: 70,
  },
  {
    id: 2,
    title: 'Python (Intermediate)',
    description: 'Demonstrate intermediate Python knowledge including OOP, data structures, and algorithms',
    durationMinutes: 75,
    questionCount: 20,
    participantCount: 8200,
    difficulty: 'Intermediate',
    passingScore: 70,
  },
  {
    id: 3,
    title: 'Data Structures',
    description: 'Prove your understanding of arrays, linked lists, trees, graphs, and hash tables',
    durationMinutes: 90,
    questionCount: 25,
    participantCount: 15300,
    difficulty: 'Advanced',
    passingScore: 70,
  },
  {
    id: 4,
    title: 'Algorithms',
    description: 'Test your algorithmic thinking with sorting, searching, and optimization problems',
    durationMinutes: 90,
    questionCount: 25,
    participantCount: 9800,
    difficulty: 'Advanced',
    passingScore: 70,
  },
  {
    id: 5,
    title: 'SQL (Basic)',
    description: 'Demonstrate basic SQL skills including SELECT, JOIN, GROUP BY, and filtering',
    durationMinutes: 60,
    questionCount: 18,
    participantCount: 20100,
    difficulty: 'Basic',
    passingScore: 70,
  },
  {
    id: 6,
    title: 'React (Intermediate)',
    description: 'Test your React knowledge including hooks, state management, and component lifecycle',
    durationMinutes: 75,
    questionCount: 20,
    participantCount: 6700,
    difficulty: 'Intermediate',
    passingScore: 70,
  },
];

const CertifySection: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const loadCertifications = async () => {
      setLoading(true);
      try {
        const data = await fetchCertifications(token || undefined);
        setCertifications(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load certifications');
      } finally {
        setLoading(false);
      }
    };

    loadCertifications();
  }, [token]);

  const displayedCertifications = useMemo(
      () => (certifications.length ? certifications : fallbackCertifications),
      [certifications]
  );

  const totalParticipants = displayedCertifications.reduce(
      (sum, cert) => sum + (cert.participantCount || 0),
      0
  );

  const averagePassingScore =
      displayedCertifications.length > 0
          ? Math.round(
              (displayedCertifications.reduce((sum, cert) => sum + (cert.passingScore || 0), 0) /
                  displayedCertifications.length) *
              10
          ) /
          10
          : 0;

  const handleStart = (cert: Certification) => {
    if (!user) {
      setNotice('Please sign in to start a certification.');
      return;
    }
    setNotice(`Preparing ${cert.title} for ${user.username}. Good luck!`);
  };

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certify</h1>
          <p className="text-gray-600">Earn certificates to validate your technical skills</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{displayedCertifications.length}</div>
                <div className="text-sm text-gray-600">Available Certifications</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalParticipants.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Participants</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{averagePassingScore}%</div>
                <div className="text-sm text-gray-600">Passing Score</div>
              </div>
            </div>
          </div>
        </div>

        {notice && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
              {notice}
            </div>
        )}

        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              {error}
            </div>
        )}

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedCertifications.map((cert) => (
              <div
                  key={cert.id}
                  className="rounded-lg border-2 p-6 transition-all hover:shadow-lg bg-white border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{cert.title}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border">
                  {cert.difficulty || 'General'}
                </span>
                  </div>
                  <Award className="w-8 h-8 text-gray-400" />
                </div>

                <p className="text-gray-700 mb-4">{cert.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{cert.durationMinutes ? `${cert.durationMinutes} minutes` : 'Self-paced'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{cert.questionCount || 0} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{cert.participantCount?.toLocaleString() || 'N/A'}</span>
                  </div>
                </div>

                <button
                    className="w-full text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={() => handleStart(cert)}
                    disabled={loading}
                >
                  <span>{user ? 'Start Test' : 'Sign in to start'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
          ))}
        </div>

        {loading && (
            <div className="mt-6 text-sm text-gray-600">Loading certifications from the server...</div>
        )}

        {/* Information */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How Certification Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>Take the timed test with multiple choice and coding questions</div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>Score 70% or higher to pass and earn your certificate</div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>Share your verified certificate on LinkedIn and resume</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CertifySection;