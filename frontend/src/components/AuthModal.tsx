/**
 * AuthModal.tsx
 * Sign in / Sign up modal dialog.
 */

import { useState } from "react";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

type Mode = "signin" | "signup";

export function AuthModal({ onSuccess, onClose, signin, signup }: Props) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signin") {
        await signin(email, password);
      } else {
        await signup(email, password);
      }
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-md w-full animate-slide-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn-ghost text-xl leading-none"
          aria-label="Close modal"
          id="auth-modal-close"
        >
          ×
        </button>

        <h2 className="text-2xl font-display font-bold text-gradient mb-1">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-surface-400 text-sm mb-6">
          {mode === "signin"
            ? "Sign in to save your scores to the leaderboard."
            : "Register to track your scores across sessions."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-surface-300 mb-1.5">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-surface-300 mb-1.5">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="input-field"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-surface-400 text-sm mt-5">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
            className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            id="auth-mode-toggle"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
