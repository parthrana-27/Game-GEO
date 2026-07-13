/**
 * useGame.ts
 * Manages the full game lifecycle state and API interactions.
 */

import { useState, useCallback } from "react";
import {
  apiStartGame,
  apiGetRound,
  apiSubmitGuess,
  apiNextRound,
  apiGetSummary,
} from "../api/client";
import type {
  Region,
  GamePhase,
  RoundLocationResponse,
  GuessResult,
  GameSummary,
} from "../types";

interface GameState {
  phase: GamePhase;
  gameId: string | null;
  roundInfo: RoundLocationResponse | null;
  guessResult: GuessResult | null;
  gameSummary: GameSummary | null;
  error: string | null;
  loading: boolean;
  region: Region | null;
}

const initialState: GameState = {
  phase: "idle",
  gameId: null,
  roundInfo: null,
  guessResult: null,
  gameSummary: null,
  error: null,
  loading: false,
  region: null,
};

export function useGame() {
  const [state, setState] = useState<GameState>(initialState);

  const setLoading = (loading: boolean) =>
    setState((s) => ({ ...s, loading, error: null }));
  const setError = (error: string) =>
    setState((s) => ({ ...s, error, loading: false }));

  /** Start a brand-new game session. */
  const startGame = useCallback(async (region: Region) => {
    setLoading(true);
    try {
      const started = await apiStartGame(region);
      const round = await apiGetRound(started.gameId);
      setState((s) => ({
        ...s,
        phase: "playing",
        gameId: started.gameId,
        roundInfo: round,
        region: region,
        guessResult: null,
        gameSummary: null,
        loading: false,
      }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to start game");
    }
  }, []);

  /** Submit the player's guess for the current round. */
  const submitGuess = useCallback(
    async (lat: number, lng: number) => {
      if (!state.gameId) return;
      setLoading(true);
      try {
        const result = await apiSubmitGuess(state.gameId, lat, lng);
        setState((s) => ({
          ...s,
          phase: "result",
          guessResult: result,
          loading: false,
        }));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to submit guess");
      }
    },
    [state.gameId]
  );

  /** Move to the next round. */
  const goNextRound = useCallback(async () => {
    if (!state.gameId) return;
    if (state.guessResult?.isLastRound) {
      // Game is done — fetch summary
      setLoading(true);
      try {
        const summary = await apiGetSummary(state.gameId);
        setState((s) => ({
          ...s,
          phase: "summary",
          gameSummary: summary,
          loading: false,
        }));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load summary");
      }
      return;
    }

    setLoading(true);
    try {
      await apiNextRound(state.gameId);
      const round = await apiGetRound(state.gameId);
      setState((s) => ({
        ...s,
        phase: "playing",
        roundInfo: round,
        guessResult: null,
        loading: false,
      }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to advance round");
    }
  }, [state.gameId, state.guessResult]);

  /** Reset back to the home screen. */
  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  /** Navigate to the leaderboard. */
  const goLeaderboard = useCallback(() => {
    setState((s) => ({ ...s, phase: "leaderboard" }));
  }, []);

  /** Navigate back from leaderboard to home. */
  const goHome = useCallback(() => {
    setState((s) => ({ ...s, phase: "idle" }));
  }, []);

  return {
    ...state,
    startGame,
    submitGuess,
    goNextRound,
    resetGame,
    goLeaderboard,
    goHome,
  };
}
