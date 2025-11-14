import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
const normalizeUser = (value) => {
  if (!value || typeof value !== "object") return value;
  return {
    ...value,
    favoriteMovies: Array.isArray(value.favoriteMovies)
      ? value.favoriteMovies
      : [],
    ratings: Array.isArray(value.ratings) ? value.ratings : [],
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = not checked yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setUserSafe = useCallback((value) => {
    if (typeof value === "function") {
      setUser((prev) => {
        const nextValue = value(prev);
        return normalizeUser(nextValue);
      });
    } else {
      setUser(normalizeUser(value));
    }
  }, []);

  // Initial session hydration
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        if (!ok) return;
        setUserSafe(data?.user ?? data ?? null);
      } catch {
        if (!ok) return;
        setUserSafe(null);
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
      if (data?.user) setUserSafe(data.user);
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
      if (data?.user) setUserSafe(data.user);
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
      // flatten nested structure
      const loggedUser = data.user?.user || data.user;
      setUserSafe(loggedUser);
      return loggedUser;
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
      setUserSafe(null);
    } catch (err) {
      console.error("Logout failed:", err);
      throw err;
    }
  };
  const refreshMe = async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUserSafe(data?.user ?? data ?? null);
      return data;
    } catch (e) {
      setUserSafe(null);
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
      setUser: setUserSafe,
      clearError: () => setError(null),
    }),
    [user, loading, error, setUserSafe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
