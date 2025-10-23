import React, { useState } from 'react';
import Header from './components/Header';
import PrepareSection from './components/PrepareSection';
import CertifySection from './components/CertifySection';
import CompeteSection from './components/CompeteSection';
import ProblemDetail from './components/ProblemDetail';
import { problems } from './data/problems';
import { Problem } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('prepare');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

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
        return <PrepareSection problems={problems} onProblemSelect={handleProblemSelect} />;
      case 'certify':
        return <CertifySection />;
      case 'compete':
        return <CompeteSection />;
      default:
        return <PrepareSection problems={problems} onProblemSelect={handleProblemSelect} />;
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