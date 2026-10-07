import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentAdmin, loginAdmin, logoutAdmin } from "../lib/api";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await getCurrentAdmin();
      setAdmin(response.data);
      return response.data;
    } catch {
      setAdmin(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshSession();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refreshSession]);

  const login = useCallback(async (credentials) => {
    const response = await loginAdmin(credentials);
    setAdmin(response.data);
    return response.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      setAdmin(null);
    }
  }, []);

  const value = useMemo(
    () => ({ admin, isLoading, login, logout, refreshSession }),
    [admin, isLoading, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
