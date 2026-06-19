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
