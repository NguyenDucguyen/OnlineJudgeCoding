import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Problem } from '../types';

interface ProblemCardProps {
  problem: Problem;
  onClick: (problem: Problem) => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return <CheckCircle className="w-4 h-4" />;
      case 'Medium': return <Clock className="w-4 h-4" />;
      case 'Hard': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div 
      onClick={() => onClick(problem)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {problem.title}
        </h3>
        {problem.solved && (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        )}
      </div>
      
      <div className="flex items-center space-x-4 mb-3">
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
          {getDifficultyIcon(problem.difficulty)}
          <span>{problem.difficulty}</span>
        </span>
        <span className="text-sm text-gray-500">{problem.category}</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {problem.description.slice(0, 120)}...
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {problem.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        {problem.attempts > 0 && (
          <span className="text-xs text-gray-500">
            {problem.attempts} attempt{problem.attempts > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProblemCard;