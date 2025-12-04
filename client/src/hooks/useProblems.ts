import { useEffect, useRef, useState } from 'react';
import { Problem } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';
const problemCache: { data: Problem[] | null } = { data: null };

const formatDifficulty = (difficulty?: string): Problem['difficulty'] => {
  const normalized = (difficulty ?? '').toLowerCase();
  if (normalized === 'easy') return 'Easy';
  if (normalized === 'medium') return 'Medium';
  if (normalized === 'hard') return 'Hard';
  return 'Easy';
};

const normalizeProblem = (raw: any): Problem => ({
  id: raw.id,
  title: raw.title,
  description: raw.description ?? '',
  difficulty: formatDifficulty(raw.difficulty),
  category: raw.category ?? 'General',
  examples: raw.examples ?? [],
  constraints: raw.constraints ?? [],
  tags: raw.tags ?? [],
  solved: raw.solved ?? false,
  attempts: raw.attempts ?? 0,
  timeLimit: raw.timeLimit,
  memoryLimit: raw.memoryLimit,
});

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>(problemCache.data ?? []);
  const [loading, setLoading] = useState(!problemCache.data);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const fetchProblems = async () => {
    abortController.current?.abort();
    abortController.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/problems`, {
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to load problems');
      }

      const data = await response.json();
      const normalized = Array.isArray(data) ? data.map(normalizeProblem) : [];
      problemCache.data = normalized;
      setProblems(normalized);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message ?? 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!problemCache.data) {
      fetchProblems();
    }

    return () => abortController.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { problems, loading, error, refresh: fetchProblems } as const;
};
