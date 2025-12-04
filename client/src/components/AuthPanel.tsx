import React, { useState } from 'react';
import { LogIn, LogOut, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPanel: React.FC = () => {
  const { user, loading, error, login, register, logout } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    try {
      if (mode === 'login') {
        await login(email, password, isAdmin ? 'admin' : 'user');
        setSuccessMessage('Signed in successfully');
      } else {
        await register(username, email, password);
        setSuccessMessage('Account created and signed in');
      }
    } catch (err) {
      // error state handled by context
    }
  };

  if (user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Signed in as</p>
            <p className="text-lg font-semibold text-gray-900">{user.username}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.role && (
              <div className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <ShieldCheck className="w-4 h-4 mr-1" />
                {user.role}
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Access your account</h3>
            <p className="text-sm text-gray-600">Sign in to unlock submissions and history.</p>
          </div>
          <div className="flex space-x-2" role="group" aria-label="Authentication mode">
            <button
              onClick={() => setMode('login')}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium border ${
                mode === 'login'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 border-gray-200'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              onClick={() => setMode('register')}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium border ${
                mode === 'register'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'text-gray-700 hover:bg-gray-50 border-gray-200'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {mode === 'register' && (
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                placeholder="coder01"
              />
            </div>
          )}

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="col-span-1 flex items-center space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
            {mode === 'login' && (
              <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Admin</span>
              </label>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mt-3 p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPanel;
