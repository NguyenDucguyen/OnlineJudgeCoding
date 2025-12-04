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

function App() {
  const [activeTab, setActiveTab] = useState('prepare');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [problems, setProblems] = useState<Problem[]>(fallbackProblems as Problem[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProblems = async () => {
      setLoading(true);
      try {
        const remote = await fetchProblems();
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
  }, []);

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
      return <ProblemDetail problem={selectedProblem} onBack={handleBackToProblems} />;
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
        return <SubmissionHistory />;
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
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;