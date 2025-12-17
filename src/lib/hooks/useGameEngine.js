"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for managing the PuzzleScript game engine
 *
 * This hook handles:
 * - Loading the engine scripts dynamically
 * - Initializing the canvas
 * - Compiling PuzzleScript code
 * - Running the game
 * - Handling input
 */
export function useGameEngine(canvas, options = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState(null);

  const engineRef = useRef(null);
  const scriptsLoadedRef = useRef(false);

  // Callback for console messages
  const { onConsoleMessage = console.log } = options;

  // Load engine scripts dynamically
  const loadEngineScripts = useCallback(async () => {
    if (scriptsLoadedRef.current || typeof window === "undefined") {
      return;
    }

    try {
      // First load the init script that sets up the environment
      await loadScript("/lib/engine/init.js");

      // Set up the console callback
      window.reactConsolePrint = onConsoleMessage;

      // The engine scripts need to be loaded in a specific order
      // because they depend on global variables from each other
      const scriptOrder = [
        "/lib/engine/storagewrapper.js",
        "/lib/engine/debug_off.js",
        "/lib/engine/globalVariables.js",
        "/lib/engine/rng.js",
        "/lib/engine/riffwave.js", // Required by sfxr.js
        "/lib/engine/sfxr.js", // Required by inputoutput.js (ULBS function)
        "/lib/engine/colors.js",
        "/lib/engine/font.js",
        "/lib/engine/graphics.js",
        "/lib/engine/engine.js", // Must be before compiler.js (Level class)
        "/lib/engine/parser.js", // Now safe to load with mock CodeMirror
        "/lib/engine/compiler.js",
        "/lib/engine/inputoutput.js",
      ];

      for (const src of scriptOrder) {
        await loadScript(src);
      }

      scriptsLoadedRef.current = true;
      setIsLoaded(true);
      onConsoleMessage("Engine loaded successfully");
    } catch (err) {
      setError(err.message);
      onConsoleMessage(`Error loading engine: ${err.message}`);
    }
  }, [onConsoleMessage]);

  // Initialize engine when canvas is available
  useEffect(() => {
    if (!canvas) return;

    // Set up global canvas reference using init.js helper
    if (typeof window !== "undefined") {
      if (window.initCanvas) {
        window.initCanvas(canvas);
      } else {
        // Fallback if init.js hasn't loaded yet
        window.canvas = canvas;
        window.gameCanvas = canvas;
        window.ctx = canvas.getContext("2d");
      }

      // Update console callback
      window.reactConsolePrint = onConsoleMessage;
    }

    // Load scripts
    loadEngineScripts();

    return () => {
      // Cleanup
      if (typeof window !== "undefined") {
        // Stop any running game loop
        if (window.timer) {
          clearInterval(window.timer);
        }
      }
    };
  }, [canvas, loadEngineScripts, onConsoleMessage]);

  // Compile PuzzleScript code
  const compile = useCallback(
    (code) => {
      if (!isLoaded) {
        onConsoleMessage("Engine not loaded yet");
        return false;
      }

      setIsCompiling(true);
      setError(null);

      try {
        // Use the helper function from init.js if available
        if (typeof window !== "undefined") {
          if (window.compileAndRun) {
            const result = window.compileAndRun(code);
            setIsCompiling(false);
            if (result) {
              setGameState(window.state);
              return true;
            }
            return false;
          }

          // Fallback to direct compile call
          if (window.compile) {
            // Set the code in the editor (the engine expects this)
            if (window.editor) {
              window.editor.setValue(code);
            }

            // Compile
            const result = window.compile(["restart"], code);

            if (result) {
              onConsoleMessage("Compilation successful");
              setGameState(window.state);
              setIsCompiling(false);
              return true;
            } else {
              onConsoleMessage("Compilation failed");
              setIsCompiling(false);
              return false;
            }
          }
        }
      } catch (err) {
        setError(err.message);
        onConsoleMessage(`Compilation error: ${err.message}`);
      }

      setIsCompiling(false);
      return false;
    },
    [isLoaded, onConsoleMessage],
  );

  // Run the game
  const run = useCallback(
    (code) => {
      if (!isLoaded) {
        onConsoleMessage("Engine not loaded yet");
        return false;
      }

      // First compile
      const compiled = compile(code);
      if (!compiled) {
        return false;
      }

      try {
        // Start the game
        if (typeof window !== "undefined") {
          // Initialize the game
          if (window.loadGame) {
            window.loadGame();
          }

          // Start the game loop
          if (window.startGame) {
            window.startGame();
          }

          setIsRunning(true);
          onConsoleMessage("Game started");
          return true;
        }
      } catch (err) {
        setError(err.message);
        onConsoleMessage(`Error starting game: ${err.message}`);
      }

      return false;
    },
    [isLoaded, compile, onConsoleMessage],
  );

  // Rebuild without restarting
  const rebuild = useCallback(
    (code) => {
      if (!isLoaded) {
        onConsoleMessage("Engine not loaded yet");
        return false;
      }

      try {
        if (typeof window !== "undefined") {
          // Use helper function from init.js if available
          if (window.rebuildGame) {
            const result = window.rebuildGame(code);
            if (result) {
              onConsoleMessage("Rebuild successful");
              return true;
            }
            return false;
          }

          // Fallback to direct compile call
          if (window.compile) {
            if (window.editor) {
              window.editor.setValue(code);
            }
            const result = window.compile(["rebuild"], code);

            if (result) {
              onConsoleMessage("Rebuild successful");
              return true;
            }
          }
        }
      } catch (err) {
        setError(err.message);
        onConsoleMessage(`Rebuild error: ${err.message}`);
      }

      return false;
    },
    [isLoaded, onConsoleMessage],
  );

  // Stop the game
  const stop = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.timer) {
        clearInterval(window.timer);
      }
      setIsRunning(false);
      onConsoleMessage("Game stopped");
    }
  }, [onConsoleMessage]);

  return {
    isLoaded,
    isCompiling,
    isRunning,
    error,
    gameState,
    compile,
    run,
    rebuild,
    stop,
  };
}

// Helper function to load a script dynamically
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false; // Load in order
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export default useGameEngine;
