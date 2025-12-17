/**
 * PuzzleScript Engine - React Integration
 *
 * This module provides a bridge between the original PuzzleScript engine
 * (which uses global variables) and React components.
 */

// Engine state - will be populated when engine loads
let engineLoaded = false;
let engineCanvas = null;
let engineContext = null;

// Callbacks for React integration
let onConsoleMessage = null;
let onGameStateChange = null;
let onError = null;

/**
 * Initialize the engine with a canvas element
 */
export function initEngine(canvas, callbacks = {}) {
  if (!canvas) {
    console.error('Canvas element is required');
    return false;
  }

  engineCanvas = canvas;
  engineContext = canvas.getContext('2d');

  // Store callbacks
  onConsoleMessage = callbacks.onConsoleMessage || console.log;
  onGameStateChange = callbacks.onGameStateChange || (() => {});
  onError = callbacks.onError || console.error;

  // Set up global references that the engine expects
  if (typeof window !== 'undefined') {
    window.gameCanvas = canvas;
    window.ctx = engineContext;
  }

  engineLoaded = true;
  return true;
}

/**
 * Check if engine is loaded
 */
export function isEngineLoaded() {
  return engineLoaded;
}

/**
 * Get the canvas element
 */
export function getCanvas() {
  return engineCanvas;
}

/**
 * Get the canvas context
 */
export function getContext() {
  return engineContext;
}

/**
 * Log a message to the console (React callback)
 */
export function logMessage(message, isError = false) {
  if (isError && onError) {
    onError(message);
  } else if (onConsoleMessage) {
    onConsoleMessage(message);
  }
}

/**
 * Notify React of game state changes
 */
export function notifyStateChange(state) {
  if (onGameStateChange) {
    onGameStateChange(state);
  }
}

// Export for use in other modules
export default {
  initEngine,
  isEngineLoaded,
  getCanvas,
  getContext,
  logMessage,
  notifyStateChange,
};
