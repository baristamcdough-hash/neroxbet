"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (activeTab === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      setEmail("");
      setPassword("");
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-[61] w-full max-w-sm mx-4 bg-background-panel rounded-lg p-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-background-main rounded-full p-0.5 mb-6">
          <button
            onClick={() => { setActiveTab("login"); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === "login"
                ? "bg-accents-lime text-white"
                : "text-gray-400"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveTab("register"); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === "register"
                ? "bg-accents-lime text-white"
                : "text-gray-400"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-xs text-gray-400 mb-1">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background-main border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accents-lime"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-xs text-gray-400 mb-1">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-background-main border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accents-lime"
              placeholder="Min 6 characters"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accents-lime text-white font-bold py-3 rounded-lg hover:bg-accents-lime/90 transition-colors disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : activeTab === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
