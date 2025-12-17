"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import GameCanvas from "@/components/GameCanvas";
import { useGameEngine } from "@/lib/hooks/useGameEngine";

function PlayPageContent() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("game");
  const gameCode = searchParams.get("code"); // Support loading from URL parameter
  const [canvas, setCanvas] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [messages, setMessages] = useState([]);

  // Console message handler
  const handleEngineMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
    console.log("[Game]", message);
  }, []);

  // Initialize game engine
  const {
    isLoaded: engineLoaded,
    isRunning,
    error: engineError,
    run,
  } = useGameEngine(canvas, {
    onConsoleMessage: handleEngineMessage,
  });

  // Load and run game when engine is ready
  useEffect(() => {
    if (!engineLoaded || !canvas) return;

    const loadAndRunGame = async () => {
      let code = null;

      // Try to load from URL parameter first
      if (gameCode) {
        try {
          code = decodeURIComponent(gameCode);
        } catch (e) {
          console.error("Failed to decode game code from URL:", e);
        }
      }

      // Try to load from demo files
      if (!code && gameId) {
        try {
          const response = await fetch(`/demo/${gameId}.txt`);
          if (response.ok) {
            code = await response.text();
            setGameData({ title: gameId });
          }
        } catch (e) {
          console.error("Failed to load game:", e);
        }
      }

      // Try to load from localStorage
      if (!code) {
        const savedCode = localStorage.getItem("puzzlescript_code");
        if (savedCode) {
          code = savedCode;
        }
      }

      // Run the game if we have code
      if (code) {
        run(code);
      } else {
        handleEngineMessage("No game code found");
      }
    };

    loadAndRunGame();
  }, [engineLoaded, canvas, gameId, gameCode, run, handleEngineMessage]);

  const handleCanvasReady = useCallback((canvasElement) => {
    setCanvas(canvasElement);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="bg-puzzlescript-panel px-4 py-2 flex items-center justify-between border-b border-puzzlescript-accent">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">
            {gameData?.title || "PuzzleScript Game"}
          </h1>
          {!engineLoaded && (
            <span className="text-sm text-yellow-400">Loading engine...</span>
          )}
          {engineLoaded && !isRunning && (
            <span className="text-sm text-blue-400">Ready</span>
          )}
          {isRunning && (
            <span className="text-sm text-green-400">Running</span>
          )}
          {engineError && (
            <span className="text-sm text-red-400">Error: {engineError}</span>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="toolbar-button"
          >
            Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="toolbar-button"
          >
            Restart
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <GameCanvas onCanvasReady={handleCanvasReady} />
      </div>

      <div className="bg-puzzlescript-panel px-4 py-2 text-center text-sm text-gray-400 border-t border-puzzlescript-accent">
        Use arrow keys to move. Press Z to undo. Press R to restart level.
      </div>

      {/* Debug messages */}
      {messages.length > 0 && (
        <div className="absolute bottom-16 left-4 right-4 bg-black/80 text-white text-xs p-2 max-h-32 overflow-auto">
          {messages.slice(-5).map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-black text-white">
          Loading...
        </div>
      }
    >
      <PlayPageContent />
    </Suspense>
  );
}
