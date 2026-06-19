/**
 * useAuth.ts
 * Manages authentication state with localStorage persistence.
 */

import { useState, useCallback } from "react";
import { apiSignin, apiSignup } from "../api/client";
import type { AuthState, AuthUser } from "../types";

const TOKEN_KEY = "ss_token";
const USER_KEY = "ss_user";

function loadFromStorage(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (token && userRaw) {
      return { token, user: JSON.parse(userRaw) as AuthUser };
    }
  } catch {
    // ignore
  }
  return { token: null, user: null };
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(loadFromStorage);

  const signin = useCallback(async (email: string, password: string) => {
    const result = await apiSignin(email, password);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setAuth({ token: result.token, user: result.user });
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    await apiSignup(email, password);
    // Auto-signin after registration
    await signin(email, password);
  }, [signin]);

  const signout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuth({ token: null, user: null });
  }, []);

  return { auth, signin, signup, signout };
}
