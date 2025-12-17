/**
 * PuzzleScript Engine Initialization for React
 *
 * This file sets up the global environment that the PuzzleScript engine expects,
 * bridging between the original DOM-based code and React components.
 */

// Console output callback - will be set by React
window.reactConsolePrint = null;

// Mock CodeMirror for parser.js (we're not using the syntax highlighting yet)
window.CodeMirror = window.CodeMirror || {
  defineMode: function(name, fn) {
    console.log('[PuzzleScript] CodeMirror.defineMode called for:', name);
  },
  defineMIME: function(mime, mode) {},
  registerHelper: function() {},
  modes: {},
  mimeModes: {}
};

// Mock AudioContext for sound generation
window.AudioContext = window.AudioContext || window.webkitAudioContext || function() {
  return {
    createBuffer: function() { return {}; },
    createBufferSource: function() { return { connect: function() {}, start: function() {} }; },
    destination: {}
  };
};

// Override consolePrint to send messages to React
window.consolePrint = function(text, urgent, linenumber, inspect_ID) {
  if (window.reactConsolePrint) {
    // Strip HTML tags for React display
    const cleanText = text.replace(/<[^>]*>/g, '');
    window.reactConsolePrint(cleanText);
  }
  console.log('[PuzzleScript]', text);
};

window.consolePrintFromRule = function(text, rule, urgent) {
  if (window.reactConsolePrint) {
    const cleanText = `Rule ${rule.lineNumber}: ${text}`;
    window.reactConsolePrint(cleanText);
  }
};

window.consoleError = function(text) {
  if (window.reactConsolePrint) {
    const cleanText = text.replace(/<[^>]*>/g, '');
    window.reactConsolePrint(`ERROR: ${cleanText}`);
  }
  console.error('[PuzzleScript Error]', text);
};

// Mock DOM elements that the engine expects
window.consolecache = [];
window.cache_console_messages = false;

// Create mock consoletextarea if it doesn't exist
if (!document.getElementById('consoletextarea')) {
  const mockConsole = document.createElement('div');
  mockConsole.id = 'consoletextarea';
  mockConsole.style.display = 'none';
  document.body.appendChild(mockConsole);
}

// Create mock lowerarea if it doesn't exist
if (!document.getElementById('lowerarea')) {
  const mockLower = document.createElement('div');
  mockLower.id = 'lowerarea';
  mockLower.style.display = 'none';
  document.body.appendChild(mockLower);
}

// Mock form1 for code access
window.form1 = {
  code: {
    editorreference: null,
    value: ''
  }
};

// Mock editor object
window.editor = {
  _code: '',
  getValue: function() {
    return this._code;
  },
  setValue: function(code) {
    this._code = code;
  },
  getLineHandle: function() { return null; },
  scrollIntoView: function() {},
  setCursor: function() {},
  doc: {
    lastLine: function() { return 0; }
  }
};

// Set IDE mode
window.IDE = true;

// Canvas reference - will be set by React
window.canvas = null;
window.ctx = null;

// Initialize canvas when set
window.initCanvas = function(canvasElement) {
  window.canvas = canvasElement;
  window.ctx = canvasElement.getContext('2d');

  // Also set gameCanvas for compatibility
  window.gameCanvas = canvasElement;

  // Set canvas dimensions
  canvasElement.width = canvasElement.parentElement?.clientWidth || 500;
  canvasElement.height = canvasElement.parentElement?.clientHeight || 500;

  console.log('[PuzzleScript] Canvas initialized:', canvasElement.width, 'x', canvasElement.height);
  return true;
};

// Compile and run helper
window.compileAndRun = function(code) {
  if (!window.canvas) {
    console.error('[PuzzleScript] Canvas not initialized');
    return false;
  }

  // Set the code
  window.editor._code = code;

  try {
    // Call the compile function from compiler.js
    if (typeof compile === 'function') {
      const result = compile(['restart'], code);
      if (result) {
        console.log('[PuzzleScript] Compilation successful');
        return true;
      }
    } else {
      console.error('[PuzzleScript] compile function not found');
    }
  } catch (error) {
    console.error('[PuzzleScript] Compilation error:', error);
    if (window.reactConsolePrint) {
      window.reactConsolePrint(`Compilation error: ${error.message}`);
    }
  }

  return false;
};

// Rebuild helper
window.rebuildGame = function(code) {
  if (!window.canvas) {
    console.error('[PuzzleScript] Canvas not initialized');
    return false;
  }

  window.editor._code = code;

  try {
    if (typeof compile === 'function') {
      const result = compile(['rebuild'], code);
      return !!result;
    }
  } catch (error) {
    console.error('[PuzzleScript] Rebuild error:', error);
    if (window.reactConsolePrint) {
      window.reactConsolePrint(`Rebuild error: ${error.message}`);
    }
  }

  return false;
};

console.log('[PuzzleScript] Engine init.js loaded');
