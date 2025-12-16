'use client'

import Link from 'next/link'

export default function Toolbar({ onAction }) {
  const handleAction = (action) => {
    if (onAction) {
      onAction(action)
    }
  }

  return (
    <div className="bg-puzzlescript-panel border-b border-puzzlescript-accent px-4 py-2 flex items-center gap-4 text-sm flex-wrap">
      <Link href="/" className="text-xl font-bold text-white hover:text-puzzlescript-highlight">
        PuzzleScript Next
      </Link>
      <span className="text-gray-500">-</span>

      <button onClick={() => handleAction('save')} className="toolbar-button">
        SAVE
      </button>
      <span className="text-gray-500">-</span>

      <select
        id="loadDropDown"
        className="bg-puzzlescript-accent text-white px-2 py-1 rounded"
        onChange={(e) => handleAction({ type: 'load', value: e.target.value })}
      >
        <option value="">Load...</option>
      </select>
      <span className="text-gray-500">-</span>

      <select
        id="exampleDropdown"
        className="bg-puzzlescript-accent text-white px-2 py-1 rounded"
        onChange={(e) => handleAction({ type: 'example', value: e.target.value })}
      >
        <option value="load">Load Examples</option>
        <optgroup label="Puzzlescript Next">
          <option value="next/yasban">Yet Another Sokoban</option>
          <option value="next/333">Threes</option>
          <option value="next/2048">2048</option>
          <option value="next/bridges">Bridges</option>
          <option value="next/netgame">Net game</option>
          <option value="next/fifteen">Fifteen</option>
          <option value="other/abracadabra">Abracadabra</option>
          <option value="other/wriggle">Wriggle</option>
          <option value="next/colour_chart">Colour chart</option>
          <option value="next/starter">Starter</option>
          <option value="blank">Blank Project</option>
        </optgroup>
        <optgroup label="Puzzlescript">
          <option value="sokoban_basic">Basic Sokoban</option>
          <option value="whaleworld">Whale World</option>
          <option value="zenpuzzlegarden">Zen Puzzle Garden</option>
          <option value="microban">Microban</option>
        </optgroup>
      </select>
      <span className="text-gray-500">-</span>

      <button onClick={() => handleAction('run')} className="toolbar-button" title="Compiles and runs the current game">
        RUN
      </button>
      <span className="text-gray-500">-</span>

      <button onClick={() => handleAction('rebuild')} className="toolbar-button" title="Rebuilds the program live">
        REBUILD
      </button>
      <span className="text-gray-500">-</span>

      <button onClick={() => handleAction('levelEditor')} className="toolbar-button" title="Toggle the level editor">
        LEVEL EDITOR
      </button>
      <span className="text-gray-500">-</span>

      <button onClick={() => handleAction('export')} className="toolbar-button" title="Export a standalone HTML Build">
        EXPORT
      </button>
      <span className="text-gray-500">-</span>

      <button onClick={() => handleAction('share')} className="toolbar-button" title="Generate a shareable link">
        SHARE
      </button>
      <span className="text-gray-500">-</span>

      <Link href="/Documentation/documentation.html" target="_blank" className="toolbar-button">
        DOCS
      </Link>
      <span className="text-gray-500">-</span>

      <button onClick={() => handleAction('solve')} className="toolbar-button" title="Solve a level">
        SOLVE
      </button>
    </div>
  )
}
