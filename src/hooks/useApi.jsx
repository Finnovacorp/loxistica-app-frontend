import { useState, useCallback } from "react";
import { api } from "../lib/api.js";

/**
 * useApi — wraps api.get / api.post with loading, error, and data state.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi();
 *   execute(() => api.get(ENDPOINTS.get_my_tasks, { status: 'Pending' }));
 */
export function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (e) {
      setError(e.message ?? "Unknown error");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * useSubmit — for mutation operations (POST). Returns { submit, loading, error, result }.
 */
export function useSubmit() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fn();
      setResult(res);
      return res;
    } catch (e) {
      setError(e.message ?? "Unknown error");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, submit, reset };
}
