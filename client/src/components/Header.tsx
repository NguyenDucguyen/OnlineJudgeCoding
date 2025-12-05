import React from 'react';
import { Code2, Trophy, Award, BookOpen, UserCircle2, LogOut } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user?: User | null;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, user, onLogout, onLoginClick }) => {
  const tabs = [
    { id: 'prepare', label: 'Prepare', icon: BookOpen },
    { id: 'certify', label: 'Certify', icon: Award },
    { id: 'compete', label: 'Compete', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: UserCircle2 }
  ];

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      window.location.assign('/auth');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Code2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CodeRank</span>
            </div>
            
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">User:</span> {user.username}
                </div>
                {user.role && (
                  <div className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold uppercase tracking-wide">
                    {user.role}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Chưa đăng nhập</span>
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                >
                  <LogOut className="w-4 h-4 rotate-180" />
                  <span>Đăng nhập/Đăng ký</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;