# Game Engine Integration Guide

This guide explains how to integrate the original PuzzleScript game engine with the new React components.

## Overview

The original PuzzleScript engine consists of several JavaScript modules in `lib/js/`:

- **engine.js** - Main game loop, level management, input handling
- **compiler.js** - PuzzleScript language parser and compiler
- **graphics.js** - Canvas rendering and sprite generation
- **parser.js** - Language parsing utilities
- **globalVariables.js** - Global state variables

## Integration Strategy

### 1. Create a Game Engine Hook

Create `lib/hooks/useGameEngine.js`:

```javascript
'use client'

import { useEffect, useRef, useState } from 'react'

export function useGameEngine(canvas) {
  const engineRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!canvas) return

    // Initialize engine
    try {
      // Load global variables
      if (typeof window !== 'undefined') {
        // Import engine modules
        // Note: These need to be adapted to work with React
        setIsReady(true)
      }
    } catch (err) {
      setError(err.message)
    }

    return () => {
      // Cleanup
      if (engineRef.current) {
        // Stop game loop
        // Remove event listeners
      }
    }
  }, [canvas])

  const compile = (code) => {
    // Call compiler
  }

  const run = () => {
    // Start game
  }

  const rebuild = () => {
    // Rebuild without restart
  }

  return {
    isReady,
    error,
    compile,
    run,
    rebuild,
  }
}
```

### 2. Adapt Global Variables

The engine uses many global variables. Options:

**Option A: Context Provider**

```javascript
// lib/context/GameContext.js
'use client'

import { createContext, useContext, useState } from 'react'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [state, setState] = useState({
    level: 0,
    playerPosition: null,
    gameState: 'idle',
    // ... other global variables
  })

  return (
    <GameContext.Provider value={{ state, setState }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
```

**Option B: Module Wrapper**

```javascript
// lib/engine/index.js
let engineState = {
  level: 0,
  playerPosition: null,
  // ... other variables
}

export function getState() {
  return engineState
}

export function setState(updates) {
  engineState = { ...engineState, ...updates }
}

export function resetState() {
  engineState = { /* initial state */ }
}
```

### 3. Load Engine Modules Dynamically

In the editor page:

```javascript
'use client'

import { useEffect, useState } from 'react'

export default function EditorPage() {
  const [engine, setEngine] = useState(null)

  useEffect(() => {
    // Load engine modules dynamically
    const loadEngine = async () => {
      if (typeof window === 'undefined') return

      // Load scripts in order
      const scripts = [
        '/lib/js/globalVariables.js',
        '/lib/js/font.js',
        '/lib/js/rng.js',
        '/lib/js/colors.js',
        '/lib/js/graphics.js',
        '/lib/js/engine.js',
        '/lib/js/compiler.js',
        // ... other modules
      ]

      for (const src of scripts) {
        await loadScript(src)
      }

      setEngine(window.PuzzleScriptEngine) // Assuming engine exports itself
    }

    loadEngine()
  }, [])

  return (
    // ... component JSX
  )
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}
```

### 4. Connect Canvas to Engine

```javascript
// In EditorPage component
const handleCanvasReady = (canvasElement) => {
  setCanvas(canvasElement)

  if (engine && canvasElement) {
    // Initialize engine with canvas
    const ctx = canvasElement.getContext('2d')
    engine.init(canvasElement, ctx)
  }
}
```

### 5. Handle Compilation

```javascript
const handleCompile = (code) => {
  if (!engine) {
    addConsoleMessage('Engine not ready')
    return
  }

  try {
    // Clear previous errors
    setConsoleMessages([])

    // Compile code
    const result = engine.compile(code)

    if (result.errors && result.errors.length > 0) {
      result.errors.forEach(err => {
        addConsoleMessage(`Error: ${err.message}`)
      })
    } else {
      addConsoleMessage('Compilation successful')
      return result
    }
  } catch (error) {
    addConsoleMessage(`Compilation error: ${error.message}`)
  }
}
```

### 6. Handle Game Loop

```javascript
const handleRun = () => {
  if (!engine || !canvas) {
    addConsoleMessage('Engine or canvas not ready')
    return
  }

  try {
    // Compile first
    const compiled = handleCompile(code)
    if (!compiled) return

    // Start game
    engine.run(compiled)
    addConsoleMessage('Game started')
  } catch (error) {
    addConsoleMessage(`Error starting game: ${error.message}`)
  }
}
```

## Module Modifications Needed

### globalVariables.js

Wrap in a module:

```javascript
// Before:
var level = 0;
var playerPosition = null;

// After:
export const gameState = {
  level: 0,
  playerPosition: null,
  // ... other variables
}

export function resetGameState() {
  gameState.level = 0
  gameState.playerPosition = null
  // ... reset other variables
}
```

### engine.js

Export main functions:

```javascript
// At the end of engine.js
export {
  init,
  compile,
  run,
  rebuild,
  processInput,
  // ... other public functions
}
```

### graphics.js

Ensure canvas context is passed:

```javascript
let canvasContext = null

export function initGraphics(canvas, ctx) {
  canvasContext = ctx
  // ... initialization
}

export function render() {
  if (!canvasContext) return
  // ... rendering code
}
```

## Event Handling

### Keyboard Input

```javascript
// In EditorPage
useEffect(() => {
  const handleKeyDown = (e) => {
    if (!engine) return

    // Pass to engine
    engine.processInput(e)
  }

  window.addEventListener('keydown', handleKeyDown)

  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
}, [engine])
```

### Mouse Input

```javascript
const handleCanvasClick = (e) => {
  if (!engine) return

  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  engine.processClick(x, y)
}
```

## Storage Integration

### Save Game

```javascript
const handleSave = () => {
  const saveData = {
    code,
    timestamp: Date.now(),
    name: 'My Game'
  }

  localStorage.setItem('puzzlescript_current', JSON.stringify(saveData))

  // Add to saved games list
  const saved = JSON.parse(localStorage.getItem('puzzlescript_saves') || '[]')
  saved.push(saveData)
  localStorage.setItem('puzzlescript_saves', JSON.stringify(saved))

  addConsoleMessage('Game saved')
}
```

### Load Game

```javascript
const handleLoad = (saveId) => {
  const saved = JSON.parse(localStorage.getItem('puzzlescript_saves') || '[]')
  const game = saved.find(s => s.id === saveId)

  if (game) {
    setCode(game.code)
    addConsoleMessage(`Loaded: ${game.name}`)
  }
}
```

## Testing Checklist

- [ ] Engine loads without errors
- [ ] Canvas initializes correctly
- [ ] Code compiles successfully
- [ ] Game renders on canvas
- [ ] Keyboard input works
- [ ] Mouse input works (if applicable)
- [ ] Save/load functionality works
- [ ] Console displays messages
- [ ] Error handling works
- [ ] Game loop runs smoothly
- [ ] Memory cleanup on unmount

## Common Issues

### Issue: "Cannot read property of undefined"

**Cause**: Engine trying to access DOM before React renders
**Solution**: Use `useEffect` and check for `typeof window !== 'undefined'`

### Issue: Global variables conflict

**Cause**: Multiple instances or hot reload
**Solution**: Wrap in module or use React context

### Issue: Canvas not rendering

**Cause**: Canvas ref not passed correctly
**Solution**: Ensure `useRef` is used and canvas is ready before engine init

### Issue: Event listeners not cleaning up

**Cause**: Missing cleanup in `useEffect`
**Solution**: Always return cleanup function

## Next Steps

1. Start with a minimal integration - just load one module
2. Test canvas rendering with simple shapes
3. Add compiler integration
4. Add input handling
5. Add full game loop
6. Add save/load
7. Add advanced features (GIF export, solver, etc.)

## Resources

- Original engine code: `lib/js/`
- React hooks documentation: https://react.dev/reference/react
- Next.js documentation: https://nextjs.org/docs
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
