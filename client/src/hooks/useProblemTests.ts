import { useEffect, useRef, useState } from 'react';
import { TestCase } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';
const testCache = new Map<number, TestCase[]>();

export const useProblemTests = (problemId?: number) => {
  const [tests, setTests] = useState<TestCase[]>(problemId && testCache.has(problemId) ? testCache.get(problemId)! : []);
  const [loading, setLoading] = useState(problemId !== undefined && !testCache.has(problemId));
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!problemId) return undefined;
    if (testCache.has(problemId)) {
      setTests(testCache.get(problemId)!);
      setLoading(false);
      return undefined;
    }

    abortController.current?.abort();
    abortController.current = new AbortController();
    setLoading(true);
    setError(null);

    const loadTests = async () => {
      try {
        const response = await fetch(`${API_BASE}/problems/${problemId}/tests`, {
          signal: abortController.current?.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load tests');
        }

        const data = await response.json();
        const normalized = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              input: item.input,
              expectedOutput: item.expectedOutput,
              hidden: Boolean(item.hidden),
            }))
          : [];

        testCache.set(problemId, normalized);
        setTests(normalized);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err.message ?? 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    loadTests();

    return () => abortController.current?.abort();
  }, [problemId]);

  return { tests, loading, error } as const;
};
