import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthResponse, User } from '../types';
import { loginUser, registerUser } from '../services/api';

type AuthMode = 'user' | 'admin';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, mode?: AuthMode) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface StoredAuth {
  user: User;
  token: string;
}

const STORAGE_KEY = 'oj_auth_state';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StoredAuth;
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (err) {
        console.error('Failed to parse auth state', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token } satisfies StoredAuth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, token]);

  const persistAuth = (payload: AuthResponse) => {
    setUser(payload.user);
    setToken(payload.token);
    setError(null);
  };

  const login = async (email: string, password: string, mode: AuthMode = 'user') => {
    setLoading(true);
    setError(null);
    try {
      const auth = await loginUser({ email, password }, mode === 'admin');
      persistAuth(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser({ username, email, password });
      const auth = await loginUser({ email, password }, false);
      persistAuth(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to register';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, error, login, register, logout }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
