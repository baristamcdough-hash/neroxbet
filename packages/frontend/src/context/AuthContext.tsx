"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { loginUser, registerUser, AuthResponse } from "@/lib/api";

interface User {
  token: string;
  userId: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("nexarox_token");
    const userId = localStorage.getItem("nexarox_userId");
    const email = localStorage.getItem("nexarox_email");
    if (token && userId && email) {
      setUser({ token, userId, email });
    }
  }, []);

  const persistSession = (data: AuthResponse, email: string) => {
    localStorage.setItem("nexarox_token", data.token);
    localStorage.setItem("nexarox_userId", data.userId);
    localStorage.setItem("nexarox_email", email);
    setUser({ token: data.token, userId: data.userId, email });
  };

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginUser(email, password);
    persistSession(data, email);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const data = await registerUser(email, password);
    persistSession(data, email);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("nexarox_token");
    localStorage.removeItem("nexarox_userId");
    localStorage.removeItem("nexarox_email");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
