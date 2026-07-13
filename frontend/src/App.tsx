/**
 * App.tsx
 * Root component. Drives the game phase state machine.
 * No React Router needed — phases are driven by useGame.
 */

import { useState } from "react";
import { useGame } from "./hooks/useGame";
import { useAuth } from "./hooks/useAuth";

import { HomePage } from "./pages/HomePage";
import { GamePage } from "./pages/GamePage";
import { SummaryPage } from "./pages/SummaryPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { AuthModal } from "./components/AuthModal";
import type { Region } from "./types";

export default function App() {
  const {
    phase,
    roundInfo,
    guessResult,
    gameSummary,
    loading,
    error,
    region,
    startGame,
    submitGuess,
    goNextRound,
    resetGame,
    goLeaderboard,
    goHome,
  } = useGame();

  const { auth, signin, signup, signout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  function handlePlay(region: Region) {
    startGame(region);
  }

  return (
    <>
      {/* Fullscreen tactical loader overlay */}
      {loading && phase !== "playing" && (
        <div className="fixed inset-0 bg-surface-950/85 backdrop-blur-md z-[100] flex flex-col items-center justify-center gap-6 animate-fade-in">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Pulsing tactical radar circles */}
            <div className="absolute inset-0 border border-brand-500 rounded-full animate-ping opacity-25" />
            <div className="absolute inset-2.5 border border-brand-400 rounded-full animate-pulse opacity-40" />
            <div className="w-12 h-12 border-t-2 border-r-2 border-brand-500 rounded-full animate-spin" />
            <span className="absolute font-mono text-[9px] text-brand-400 font-extrabold tracking-widest animate-pulse">SYS_CONN</span>
          </div>
          <div className="text-center font-mono space-y-2 max-w-sm px-4">
            <h2 className="text-brand-400 font-bold tracking-widest text-xs sm:text-sm uppercase">INITIATING SECTOR IMAGERY</h2>
            <p className="text-surface-500 text-[9px] sm:text-[10px] uppercase tracking-widest animate-pulse">CONNECTING TO GEOGRAPHIC FEED SATELLITES...</p>
          </div>
        </div>
      )}

      {/* Global error toast */}
      {error && (
        <div className="fixed top-4 right-4 z-[100] px-4 py-3 bg-red-600/90 backdrop-blur text-white rounded-xl shadow-xl text-sm font-medium max-w-sm animate-slide-up">
          ⚠️ {error}
        </div>
      )}

      {/* Auth modal */}
      {showAuth && (
        <AuthModal
          onSuccess={() => setShowAuth(false)}
          onClose={() => setShowAuth(false)}
          signin={signin}
          signup={signup}
        />
      )}

      {/* Phase router */}
      {(phase === "idle" || phase === "leaderboard") && !roundInfo ? (
        phase === "leaderboard" ? (
          <LeaderboardPage onHome={goHome} />
        ) : (
          <HomePage
            auth={auth}
            onPlay={handlePlay}
            onShowAuth={() => setShowAuth(true)}
            onSignout={signout}
            onLeaderboard={goLeaderboard}
          />
        )
      ) : phase === "playing" || phase === "result" ? (
        roundInfo ? (
          <GamePage
            roundInfo={roundInfo}
            guessResult={guessResult}
            loading={loading}
            region={region}
            onSubmitGuess={submitGuess}
            onNext={goNextRound}
            onHome={resetGame}
          />
        ) : null
      ) : phase === "summary" && gameSummary ? (
        <SummaryPage
          summary={gameSummary}
          auth={auth}
          onHome={resetGame}
          onLeaderboard={goLeaderboard}
          onShowAuth={() => setShowAuth(true)}
        />
      ) : (
        // Leaderboard from within the game flow
        <LeaderboardPage onHome={goHome} />
      )}
    </>
  );
}
