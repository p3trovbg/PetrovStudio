import { useCallback, useEffect, useState } from 'react';

const AUTH_KEY = 'adminApiKey';

export function useAuth() {
    const [apiKey, setApiKey] = useState<string | null>(
    () => sessionStorage.getItem(AUTH_KEY)
  );

  useEffect(() => {
    if (apiKey) {
      sessionStorage.setItem(AUTH_KEY, apiKey);
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  }, [apiKey]);

  const isAuthenticated = !!apiKey;

  const login = useCallback((key: string) => setApiKey(key), []);
  const logout = useCallback(() => setApiKey(null), []);

  return { isAuthenticated, login, logout, apiKey };
}
