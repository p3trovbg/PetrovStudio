import { useCallback } from 'react';

const AUTH_KEY = 'adminApiKey';

export function useAuth() {
  const isAuthenticated = !!sessionStorage.getItem(AUTH_KEY);

  const login = useCallback((apiKey: string) => {
    sessionStorage.setItem(AUTH_KEY, apiKey);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
  }, []);

  const getApiKey = useCallback((): string | null => {
    return sessionStorage.getItem(AUTH_KEY);
  }, []);

  return { isAuthenticated, login, logout, getApiKey };
}
