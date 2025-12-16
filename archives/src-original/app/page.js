'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [games, setGames] = useState([])

  useEffect(() => {
    // Load games data
    // This will be populated from games_dat_next.js
    const loadGames = async () => {
      try {
        const response = await fetch('/games_dat_next.js')
        // For now, we'll use placeholder data
        setGames([
          { id: 1, title: 'Yet Another Sokoban', author: 'Demo', url: '/play?game=yasban', thumb: 'yasban.gif' },
          { id: 2, title: 'Threes', author: 'Demo', url: '/play?game=333', thumb: '333.gif' },
          { id: 3, title: '2048', author: 'Demo', url: '/play?game=2048', thumb: '2048.gif' },
        ])
      } catch (error) {
        console.error('Failed to load games:', error)
      }
    }
    loadGames()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-puzzlescript-bg to-puzzlescript-panel">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-puzzlescript-panel/50 backdrop-blur-sm rounded-lg p-8 mb-8">
          <h1 className="text-5xl font-bold mb-4 text-white">PuzzleScript Next</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-300 mb-6">
                PuzzleScript Next is an open-source HTML5 puzzle game engine,
                combining PuzzleScript, Puzzlescript Next and Pattern:Script with
                even more advanced features.
              </p>
              <Link
                href="https://github.com/david-pfx/PuzzleScriptNext/blob/master/README.md"
                className="text-puzzlescript-highlight hover:underline"
                target="_blank"
              >
                More info
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                href="/editor"
                className="bg-puzzlescript-highlight hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
              >
                Make A Game
              </Link>
              <Link
                href="/Documentation/rules101.html"
                className="bg-puzzlescript-accent hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
              >
                First Steps
              </Link>
            </div>
          </div>
        </div>

        {/* Games Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {games.map((game) => (
            <div key={game.id} className="panel rounded-lg overflow-hidden hover:scale-105 transition-transform">
              <Link href={game.url}>
                <div className="aspect-video bg-puzzlescript-accent flex items-center justify-center">
                  <span className="text-gray-400">Game Preview</span>
                </div>
              </Link>
              <div className="p-4 bg-puzzlescript-panel">
                <Link href={game.url} className="font-bold text-white hover:text-puzzlescript-highlight">
                  {game.title}
                </Link>
                <p className="text-sm text-gray-400">by {game.author}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Link */}
        <div className="text-center">
          <Link
            href="/Gallery/index.html"
            className="bg-puzzlescript-accent hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg inline-block transition-colors"
          >
            Gallery
          </Link>
        </div>
      </div>
    </div>
  )
}
