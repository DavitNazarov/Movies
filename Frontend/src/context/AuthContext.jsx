import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getErr } from "@/lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

/**
 * Assumes backend endpoints:
 * POST /api/auth/signUp {name,email,password}
 * POST /api/auth/verify-email {code}
 * POST /api/auth/login {email,password}
 * POST /api/auth/logout
 * GET  /api/auth/me -> { user } (or 401)
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = not checked yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial session hydration
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        if (!ok) return;
        setUser(data?.user ?? data ?? null);
      } catch {
        if (!ok) return;
        setUser(null);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const signUp = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/auth/signUp", {
        name,
        email,
        password,
      });
      // cookie set server-side; backend may or may not return full user
      if (data?.user) setUser(data.user);
      return data;
    } catch (e) {
      const msg = getErr(e);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/auth/verify-email", { code });
      if (data?.user) setUser(data.user);
      return data;
    } catch (e) {
      const msg = getErr(e);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data.user);
      return data;
    } catch (e) {
      const msg = getErr(e);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      // optional: navigate("/login")
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const refreshMe = async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data?.user ?? data ?? null);
      return data;
    } catch (e) {
      setUser(null);
      throw new Error(getErr(e));
    }
  };

  const value = useMemo(
    () => ({
      user, // undefined -> loading, null -> logged out, object -> logged in
      loading,
      error,
      signUp,
      verifyEmail,
      login,
      logout,
      refreshMe,
      setUser,
      clearError: () => setError(null),
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
