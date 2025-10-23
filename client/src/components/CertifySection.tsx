import React from 'react';
import { Award, Clock, Users, ArrowRight } from 'lucide-react';

const CertifySection: React.FC = () => {
  const certifications = [
    {
      id: 1,
      title: 'JavaScript (Basic)',
      description: 'Test your basic JavaScript skills including variables, functions, and control structures',
      duration: '45 minutes',
      questions: 15,
      participants: '12.5K+',
      difficulty: 'Basic',
      color: 'bg-green-50 border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 2,
      title: 'Python (Intermediate)',
      description: 'Demonstrate intermediate Python knowledge including OOP, data structures, and algorithms',
      duration: '75 minutes',
      questions: 20,
      participants: '8.2K+',
      difficulty: 'Intermediate',
      color: 'bg-blue-50 border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 3,
      title: 'Data Structures',
      description: 'Prove your understanding of arrays, linked lists, trees, graphs, and hash tables',
      duration: '90 minutes',
      questions: 25,
      participants: '15.3K+',
      difficulty: 'Advanced',
      color: 'bg-purple-50 border-purple-200',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 4,
      title: 'Algorithms',
      description: 'Test your algorithmic thinking with sorting, searching, and optimization problems',
      duration: '90 minutes',
      questions: 25,
      participants: '9.8K+',
      difficulty: 'Advanced',
      color: 'bg-red-50 border-red-200',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    {
      id: 5,
      title: 'SQL (Basic)',
      description: 'Demonstrate basic SQL skills including SELECT, JOIN, GROUP BY, and filtering',
      duration: '60 minutes',
      questions: 18,
      participants: '20.1K+',
      difficulty: 'Basic',
      color: 'bg-indigo-50 border-indigo-200',
      buttonColor: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      id: 6,
      title: 'React (Intermediate)',
      description: 'Test your React knowledge including hooks, state management, and component lifecycle',
      duration: '75 minutes',
      questions: 20,
      participants: '6.7K+',
      difficulty: 'Intermediate',
      color: 'bg-cyan-50 border-cyan-200',
      buttonColor: 'bg-cyan-600 hover:bg-cyan-700'
    }
  ];

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
              <div className="text-2xl font-bold text-gray-900">6</div>
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
              <div className="text-2xl font-bold text-gray-900">72K+</div>
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
              <div className="text-2xl font-bold text-gray-900">68%</div>
              <div className="text-sm text-gray-600">Average Pass Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert) => (
          <div key={cert.id} className={`rounded-lg border-2 p-6 transition-all hover:shadow-lg ${cert.color}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{cert.title}</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border">
                  {cert.difficulty}
                </span>
              </div>
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            
            <p className="text-gray-700 mb-4">{cert.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{cert.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>{cert.questions} questions</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{cert.participants}</span>
              </div>
            </div>
            
            <button className={`w-full text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${cert.buttonColor}`}>
              <span>Start Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

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