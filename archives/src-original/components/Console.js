'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Console({ messages = [], onAction }) {
  const [showLayers, setShowLayers] = useState(false)
  const [verboseLogging, setVerboseLogging] = useState(false)
  const [debugLogging, setDebugLogging] = useState(false)

  const handleAction = (action) => {
    if (onAction) {
      onAction(action)
    }
  }

  const soundButtons = [
    { id: 'newsound0', title: 'collect item sound', icon: 'audio1.gif' },
    { id: 'newsound7', title: 'push sounds', icon: 'audio2.gif' },
    { id: 'newsound2', title: 'explosion sound', icon: 'audio3.gif' },
    { id: 'newsound3', title: 'powerup sound', icon: 'audio4.gif' },
    { id: 'newsound9', title: 'bird tweet sound', icon: 'audio5.gif' },
    { id: 'newsound4', title: 'hurt sound', icon: 'audio6.gif' },
    { id: 'newsound5', title: 'jump sound', icon: 'audio7.gif' },
    { id: 'newsound1', title: 'pew pew sound', icon: 'audio8.gif' },
    { id: 'newsound6', title: 'selection sound', icon: 'audio9.gif' },
    { id: 'newsound8', title: 'random sound', icon: 'audio10.gif' },
  ]

  return (
    <div className="flex flex-col h-full bg-puzzlescript-panel">
      {/* Toolbar */}
      <div className="bg-puzzlescript-accent px-4 py-2 flex items-center gap-3 flex-wrap border-b border-puzzlescript-bg">
        <button
          onClick={() => handleAction('clearConsole')}
          className="hover:opacity-80 transition-opacity"
          title="clear the console"
        >
          <span className="text-white text-xs">✕ Clear</span>
        </button>

        <button
          onClick={() => {
            setVerboseLogging(!verboseLogging)
            handleAction('verboseLogging')
          }}
          className={`hover:opacity-80 transition-opacity ${verboseLogging ? 'opacity-100' : 'opacity-50'}`}
          title="toggle verbose logging"
        >
          <span className="text-white text-xs">📢 Verbose</span>
        </button>

        <button
          onClick={() => {
            setDebugLogging(!debugLogging)
            handleAction('debugLogging')
          }}
          className={`hover:opacity-80 transition-opacity ${debugLogging ? 'opacity-100' : 'opacity-50'}`}
          title="toggle compiler debug mode"
        >
          <span className="text-white text-xs">📄 Debug</span>
        </button>

        <button
          onClick={() => {
            setShowLayers(!showLayers)
            handleAction('showLayers')
          }}
          className={`hover:opacity-80 transition-opacity ${showLayers ? 'opacity-100' : 'opacity-50'}`}
          title="toggle show layers"
        >
          <span className="text-white text-xs">📚 Layers</span>
        </button>

        <button
          onClick={() => handleAction('runProgram')}
          className="hover:opacity-80 transition-opacity"
          title="run program"
        >
          <span className="text-white text-xs">▶ Run</span>
        </button>

        <button
          onClick={() => handleAction('makeGif')}
          className="hover:opacity-80 transition-opacity"
          title="make GIF"
        >
          <span className="text-white text-xs">🎬 GIF</span>
        </button>

        <button
          onClick={() => handleAction('gotoLevelAll')}
          className="hover:opacity-80 transition-opacity"
          title="make level all objects"
        >
          <span className="text-white text-xs">🎨 Level All</span>
        </button>

        <span className="text-gray-500">|</span>

        {/* Sound buttons */}
        {soundButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleAction(btn.id)}
            className="hover:opacity-80 transition-opacity text-xs text-white"
            title={btn.title}
          >
            🔊
          </button>
        ))}
      </div>

      {/* Console output */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm text-green-400 bg-black">
        <div className="whitespace-pre-wrap">
          ======================================<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PuzzleScript Next Console<br />
          &nbsp;&nbsp;&nbsp;React Edition<br />
          <br />
          Thank you for using PuzzleScript Next!<br />
          <br />
          Please see the{' '}
          <a
            href="https://github.com/david-pfx/PuzzleScriptNext"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            README
          </a>{' '}
          for more<br />
          information about this release.<br />
          ======================================<br />
          <br />
          {messages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
