import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import PrepareSection from './components/PrepareSection';
import CertifySection from './components/CertifySection';
import CompeteSection from './components/CompeteSection';
import ProblemDetail from './components/ProblemDetail';
import SubmissionHistory from './components/SubmissionHistory';
import { problems as fallbackProblems } from './data/problems';
import { Problem } from './types';
import { fetchProblems } from './services/api';
import { useAuth } from './context/AuthContext';

interface AppProps {
  onNavigateAuth?: () => void;
}

function App({ onNavigateAuth }: AppProps) {
  const [activeTab, setActiveTab] = useState('prepare');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [problems, setProblems] = useState<Problem[]>(fallbackProblems as Problem[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user, logout } = useAuth();

  useEffect(() => {
    const loadProblems = async () => {
      setLoading(true);
      try {
        const remote = await fetchProblems(token || undefined);
        const normalized = remote.map((p) => ({
          ...p,
          category: p.category || 'General',
          difficulty: formatDifficulty(p.difficulty),
          tags: p.tags || [],
          constraints: p.constraints || [],
          examples: p.examples || [],
          solved: p.solved || false,
          attempts: p.attempts || 0,
        }));
        setProblems(normalized);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load problems');
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, [token]);

  const formatDifficulty = (difficulty: string) => {
    const normalized = difficulty?.toUpperCase();
    switch (normalized) {
      case 'EASY':
        return 'Easy';
      case 'MEDIUM':
        return 'Medium';
      case 'HARD':
        return 'Hard';
      default:
        return difficulty;
    }
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
  };

  const handleBackToProblems = () => {
    setSelectedProblem(null);
  };

  const renderContent = () => {
    if (selectedProblem) {
      return (
        <ProblemDetail
          problem={selectedProblem}
          onBack={handleBackToProblems}
          currentUser={user}
          authToken={token}
        />
      );
    }

    switch (activeTab) {
      case 'prepare':
        return (
          <PrepareSection
            problems={problems}
            onProblemSelect={handleProblemSelect}
            isLoading={loading}
            error={error}
          />
        );
      case 'certify':
        return <CertifySection />;
      case 'compete':
        return <CompeteSection />;
      case 'profile':
        return user ? (
          <SubmissionHistory />
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white border rounded-lg p-6 text-center">
              <p className="text-lg font-semibold text-gray-900 mb-2">Sign in to view your submission history</p>
              <p className="text-gray-600 mb-4">Your past submissions will appear here once you are logged in.</p>
            </div>
          </div>
        );
      default:
        return (
          <PrepareSection
            problems={problems}
            onProblemSelect={handleProblemSelect}
            isLoading={loading}
            error={error}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogout={logout}
        onLoginClick={onNavigateAuth}
      />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;