"use client";

import Link from "next/link";
import {
  Save,
  Play,
  RefreshCw,
  Grid3x3,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Toolbar({ onAction, onOpenThemeEditor }) {
  const handleAction = (action) => {
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <div
      className="px-3 py-1.5 flex items-center gap-4 text-sm flex-wrap border-b"
      style={{
        backgroundColor: "var(--color-panel)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        className="text-lg font-bold hover:opacity-80 transition-opacity"
        style={{ color: "var(--color-text)" }}
      >
        PuzzleScript React
      </Link>

      {/* Settings Group */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher onOpenThemeEditor={onOpenThemeEditor} />
      </div>

      {/* File Operations Group */}
      <div className="flex items-center gap-2">
        <button onClick={() => handleAction("save")} className="toolbar-button">
          <Save size={14} />
          SAVE
        </button>

        <select
          id="loadDropDown"
          className="px-2 py-1 rounded cursor-pointer"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          }}
          onChange={(e) =>
            handleAction({ type: "load", value: e.target.value })
          }
        >
          <option value="">LOAD</option>
        </select>

        <select
          id="exampleDropdown"
          className="px-2 py-1 rounded cursor-pointer"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          }}
          onChange={(e) =>
            handleAction({ type: "example", value: e.target.value })
          }
        >
          <option value="load">EXAMPLES</option>
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
      </div>

      {/* Build & Run Group */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAction("run")}
          className="toolbar-button"
          title="Compiles and runs the current game"
        >
          <Play size={14} />
          RUN
        </button>

        <button
          onClick={() => handleAction("rebuild")}
          className="toolbar-button"
          title="Rebuilds the program live"
        >
          <RefreshCw size={14} />
          REBUILD
        </button>
      </div>

      {/* Tools Group */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAction("levelEditor")}
          className="toolbar-button"
          title="Toggle the level editor"
        >
          <Grid3x3 size={14} />
          LEVEL EDITOR
        </button>

        <button
          onClick={() => handleAction("solve")}
          className="toolbar-button"
          title="Solve a level"
        >
          <Lightbulb size={14} />
          SOLVE
        </button>
      </div>

      {/* Share & Export Group */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAction("export")}
          className="toolbar-button"
          title="Export a standalone HTML Build"
        >
          <Download size={14} />
          EXPORT
        </button>

        <button
          onClick={() => handleAction("share")}
          className="toolbar-button"
          title="Generate a shareable link"
        >
          <Share2 size={14} />
          SHARE
        </button>

        <Link
          href="/docs/documentation.html"
          target="_blank"
          className="toolbar-button"
        >
          <BookOpen size={14} />
          DOCS
        </Link>
      </div>
    </div>
  );
}
