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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-md w-full bg-surface-900 border border-surface-800 rounded-none relative p-6 animate-slide-up">
        <span className="tactical-corner-tl"></span>
        <span className="tactical-corner-tr"></span>
        <span className="tactical-corner-bl"></span>
        <span className="tactical-corner-br"></span>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn-ghost text-lg leading-none p-1 font-mono hover:text-brand-400"
          aria-label="Close modal"
          id="auth-modal-close"
        >
          ×
        </button>

        <h2 className="text-xl font-mono font-bold text-gradient uppercase tracking-widest mb-1.5">
          {mode === "signin" ? "TERMINAL_LOGIN" : "CREATE_OPERATOR"}
        </h2>
        <p className="text-surface-500 font-mono text-[10px] uppercase mb-6 leading-relaxed">
          {mode === "signin"
            ? "Authenticate identity to access remote tracking logs."
            : "Register new operator signature in database."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="auth-email" className="block text-[10px] font-mono font-bold tracking-widest text-surface-400 uppercase mb-1.5">
              EMAIL REFERENCE
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
            <label htmlFor="auth-password" className="block text-[10px] font-mono font-bold tracking-widest text-surface-400 uppercase mb-1.5">
              ACCESS PASSCODE
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 alphanumeric chars"
              className="input-field"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-none text-red-400 text-xs font-mono">
              ERR // {error.toUpperCase()}
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-xs font-mono font-bold tracking-widest uppercase py-3"
          >
            {loading ? "AUTHENTICATING..." : mode === "signin" ? "INITIATE ACCESS" : "REGISTER SIGNATURE"}
          </button>
        </form>

        <p className="text-center text-surface-500 font-mono text-[10px] uppercase mt-6">
          {mode === "signin" ? "No account registered?" : "Already registered?"}{" "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
            className="text-brand-400 hover:text-brand-350 font-bold underline transition-colors ml-1 uppercase"
            id="auth-mode-toggle"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
