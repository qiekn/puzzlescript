'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import GameCanvas from '@/components/GameCanvas'

function PlayPageContent() {
  const searchParams = useSearchParams()
  const gameId = searchParams.get('game')
  const [canvas, setCanvas] = useState(null)
  const [gameData, setGameData] = useState(null)

  useEffect(() => {
    if (gameId) {
      // Load game data based on gameId
      // TODO: Implement game loading logic
      console.log('Loading game:', gameId)
    }
  }, [gameId])

  const handleCanvasReady = (canvasElement) => {
    setCanvas(canvasElement)
    // TODO: Initialize game engine with canvas
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="bg-puzzlescript-panel px-4 py-2 flex items-center justify-between border-b border-puzzlescript-accent">
        <h1 className="text-xl font-bold text-white">
          {gameData?.title || 'PuzzleScript Game'}
        </h1>
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
    </div>
  )
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
      <PlayPageContent />
    </Suspense>
  )
}
