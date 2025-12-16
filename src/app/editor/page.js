'use client'

import { useState, useEffect, useCallback } from 'react'
import Toolbar from '@/components/Toolbar'
import CodeEditor from '@/components/CodeEditor'
import GameCanvas from '@/components/GameCanvas'
import Console from '@/components/Console'
import SplitPane from '@/components/SplitPane'

export default function EditorPage() {
  const [code, setCode] = useState('')
  const [consoleMessages, setConsoleMessages] = useState([])
  const [canvas, setCanvas] = useState(null)

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem('puzzlescript_code')
    if (savedCode) {
      setCode(savedCode)
    } else {
      // Load default starter code
      setCode(`title My Game
author Me

========
OBJECTS
========

Background
LIGHTGRAY

Player
Black Orange White Blue
.000.
.111.
22222
.333.
.3.3.

Wall
DARKGRAY

Crate
Orange Yellow
00000
0...0
0...0
0...0
00000

Target
DarkGreen
.....
.000.
.0.0.
.000.
.....

=======
LEGEND
=======

. = Background
# = Wall
P = Player
* = Crate
@ = Crate and Target
O = Target

=======
SOUNDS
=======

================
COLLISIONLAYERS
================

Background
Target
Player, Wall, Crate

======
RULES
======

[ >  Player | Crate ] -> [  >  Player | > Crate  ]

==============
WINCONDITION
==============

All Target on Crate

=======
LEVELS
=======

#####
#...#
#.P.#
#..@#
#..O#
#####
`)
    }
  }, [])

  const handleCodeChange = (newCode) => {
    setCode(newCode)
    // Save to localStorage
    localStorage.setItem('puzzlescript_code', newCode)
  }

  const handleToolbarAction = (action) => {
    console.log('Toolbar action:', action)

    if (typeof action === 'string') {
      switch (action) {
        case 'save':
          addConsoleMessage('Game saved to browser storage')
          localStorage.setItem('puzzlescript_code', code)
          break
        case 'run':
          addConsoleMessage('Running game...')
          // TODO: Integrate game engine
          break
        case 'rebuild':
          addConsoleMessage('Rebuilding game...')
          // TODO: Integrate compiler
          break
        case 'export':
          addConsoleMessage('Exporting game...')
          // TODO: Implement export functionality
          break
        case 'share':
          addConsoleMessage('Generating share link...')
          // TODO: Implement share functionality
          break
        default:
          addConsoleMessage(`Action: ${action}`)
      }
    } else if (action.type === 'example') {
      addConsoleMessage(`Loading example: ${action.value}`)
      // TODO: Load example game
    } else if (action.type === 'load') {
      addConsoleMessage(`Loading saved game: ${action.value}`)
      // TODO: Load saved game
    }
  }

  const handleConsoleAction = (action) => {
    console.log('Console action:', action)

    switch (action) {
      case 'clearConsole':
        setConsoleMessages([])
        break
      case 'verboseLogging':
        addConsoleMessage('Verbose logging toggled')
        break
      case 'debugLogging':
        addConsoleMessage('Debug logging toggled')
        break
      case 'showLayers':
        addConsoleMessage('Show layers toggled')
        break
      case 'runProgram':
        addConsoleMessage('Running program...')
        break
      case 'makeGif':
        addConsoleMessage('Creating GIF...')
        break
      default:
        if (action.startsWith('newsound')) {
          addConsoleMessage(`Generating sound: ${action}`)
        }
    }
  }

  const addConsoleMessage = useCallback((message) => {
    setConsoleMessages((prev) => [...prev, message])
  }, [])

  const handleCanvasReady = useCallback((canvasElement) => {
    setCanvas(canvasElement)
    addConsoleMessage('Canvas initialized')
  }, [addConsoleMessage])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toolbar onAction={handleToolbarAction} />

      <div className="flex-1 overflow-hidden">
        <SplitPane
          left={<CodeEditor initialCode={code} onChange={handleCodeChange} />}
          right={
            <SplitPane
              direction="vertical"
              initialLeftWidth={70}
              left={<GameCanvas onCanvasReady={handleCanvasReady} />}
              right={<Console messages={consoleMessages} onAction={handleConsoleAction} />}
            />
          }
          initialLeftWidth={40}
        />
      </div>
    </div>
  )
}
