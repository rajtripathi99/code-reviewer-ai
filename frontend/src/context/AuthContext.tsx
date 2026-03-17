import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "../lib/api";

interface User {
  _id:      string;
  username: string;
  email:    string;
  role:     "user" | "admin";
  createdAt: string;
}

interface AuthContextValue {
  user:     User | null;
  loading:  boolean;
  login:    (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout:   () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try refresh first so access token is always fresh on page load,
    // then fetch the current user. If both fail the user is logged out.
    api.post("/api/auth/refresh", {})
      .then(() => api.get("/api/auth/me"))
      .then((r) => setUser(r.data.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string): Promise<User> {
    const r = await api.post("/api/auth/login", { email, password });
    setUser(r.data.data.user);
    return r.data.data.user;
  }

  async function register(username: string, email: string, password: string): Promise<User> {
    const r = await api.post("/api/auth/register", { username, email, password });
    setUser(r.data.data.user);
    return r.data.data.user;
  }

  async function logout(): Promise<void> {
    await api.post("/api/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}