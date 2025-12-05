import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onNavigateHome?: () => void;
}

type AuthMode = 'login' | 'register';

const AuthPage: React.FC<AuthPageProps> = ({ onNavigateHome }) => {
  const { login, register, loading, error, user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && onNavigateHome) {
      onNavigateHome();
    }
  }, [user, onNavigateHome]);

  const title = useMemo(() => (mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'), [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    try {
      if (mode === 'login') {
        await login(email, password, isAdmin ? 'admin' : 'user');
        setSuccessMessage('Đăng nhập thành công');
      } else {
        await register(username, email, password);
        setSuccessMessage('Tạo tài khoản và đăng nhập thành công');
      }
      if (onNavigateHome) {
        onNavigateHome();
      }
    } catch (err) {
      // error handled by context
    }
  };

  const goHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.assign('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        <button
          type="button"
          onClick={goHome}
          className="mb-6 inline-flex items-center text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Quay về trang chủ</span>
        </button>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 bg-white/70">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <LockKeyhole className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider text-blue-600 font-semibold">Chào mừng trở lại</p>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              </div>
            </div>

            <div className="flex rounded-full bg-gray-100 p-1 mb-8">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                  mode === 'login' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                  mode === 'register' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
              >
                Đăng ký
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-semibold text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="coder01"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="••••••••"
                />
              </div>

              {mode === 'login' && (
                <label className="inline-flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Đăng nhập vai trò admin</span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-70"
              >
                {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-700 space-y-2">
              {mode === 'login' ? (
                <p>
                  Chưa có tài khoản?{' '}
                  <button
                    className="font-semibold text-blue-600 hover:underline"
                    type="button"
                    onClick={() => setMode('register')}
                  >
                    Đăng ký ngay
                  </button>
                </p>
              ) : (
                <p>
                  Đã có tài khoản?{' '}
                  <button
                    className="font-semibold text-blue-600 hover:underline"
                    type="button"
                    onClick={() => setMode('login')}
                  >
                    Đăng nhập
                  </button>
                </p>
              )}

              <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Thông tin của bạn được bảo mật an toàn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
