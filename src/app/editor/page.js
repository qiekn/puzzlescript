"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as FlexLayout from "flexlayout-react";
import Toolbar from "@/components/Toolbar";
import CodeEditor from "@/components/CodeEditor";
import GameCanvas from "@/components/GameCanvas";
import Console from "@/components/Console";
import ThemeEditor from "@/components/ThemeEditor";
import DockLayout from "@/components/DockLayout";
import { useGameEngine } from "@/lib/hooks/useGameEngine";

export default function EditorPage() {
  const [code, setCode] = useState("");
  const [consoleMessages, setConsoleMessages] = useState([]);
  const [canvas, setCanvas] = useState(null);
  const layoutRef = useRef(null);
  const codeRef = useRef(code);

  // Keep codeRef in sync with code state
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Console message handler for the engine
  const handleEngineMessage = useCallback((message) => {
    setConsoleMessages((prev) => [...prev, message]);
  }, []);

  // Initialize game engine with canvas
  const {
    isLoaded: engineLoaded,
    isCompiling,
    isRunning,
    error: engineError,
    compile,
    run,
    rebuild,
    stop,
  } = useGameEngine(canvas, {
    onConsoleMessage: handleEngineMessage,
  });

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem("puzzlescript_code");
    if (savedCode) {
      setCode(savedCode);
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
`);
    }
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Save to localStorage
    localStorage.setItem("puzzlescript_code", newCode);
  };

  // Define addConsoleMessage before it's used in other callbacks
  const addConsoleMessage = useCallback((message) => {
    setConsoleMessages((prev) => [...prev, message]);
  }, []);

  const handleToolbarAction = useCallback(
    (action) => {
      console.log("Toolbar action:", action);

      if (typeof action === "string") {
        switch (action) {
          case "save":
            addConsoleMessage("Game saved to browser storage");
            localStorage.setItem("puzzlescript_code", codeRef.current);
            break;
          case "run":
            if (!engineLoaded) {
              addConsoleMessage("Engine not loaded yet, please wait...");
              return;
            }
            addConsoleMessage("Running game...");
            run(codeRef.current);
            break;
          case "rebuild":
            if (!engineLoaded) {
              addConsoleMessage("Engine not loaded yet, please wait...");
              return;
            }
            addConsoleMessage("Rebuilding game...");
            rebuild(codeRef.current);
            break;
          case "export":
            addConsoleMessage("Exporting game...");
            // TODO: Implement export functionality
            break;
          case "share":
            addConsoleMessage("Generating share link...");
            // TODO: Implement share functionality
            break;
          default:
            addConsoleMessage(`Action: ${action}`);
        }
      } else if (action.type === "example") {
        addConsoleMessage(`Loading example: ${action.value}`);
        // TODO: Load example game
      } else if (action.type === "load") {
        addConsoleMessage(`Loading saved game: ${action.value}`);
        // TODO: Load saved game
      }
    },
    [addConsoleMessage, engineLoaded, run, rebuild],
  );

  const handleConsoleAction = (action) => {
    console.log("Console action:", action);

    switch (action) {
      case "clearConsole":
        setConsoleMessages([]);
        break;
      case "verboseLogging":
        addConsoleMessage("Verbose logging toggled");
        break;
      case "debugLogging":
        addConsoleMessage("Debug logging toggled");
        break;
      case "showLayers":
        addConsoleMessage("Show layers toggled");
        break;
      case "runProgram":
        addConsoleMessage("Running program...");
        break;
      case "makeGif":
        addConsoleMessage("Creating GIF...");
        break;
      default:
        if (action.startsWith("newsound")) {
          addConsoleMessage(`Generating sound: ${action}`);
        }
    }
  };

  const handleCanvasReady = useCallback(
    (canvasElement) => {
      setCanvas(canvasElement);
      addConsoleMessage("Canvas initialized");
    },
    [addConsoleMessage],
  );

  const handleOpenThemeEditor = useCallback(() => {
    // Switch to Theme Editor tab programmatically
    if (layoutRef.current) {
      const model = layoutRef.current.getModel();

      // Find the Theme Editor tab
      let found = false;
      model.visitNodes((node) => {
        if (node.getType() === "tab" && node.getComponent() === "themeEditor") {
          model.doAction(FlexLayout.Actions.selectTab(node.getId()));
          found = true;
        }
      });

      if (!found) {
        // Theme editor tab not found in saved layout, reset to default
        addConsoleMessage(
          "Theme Editor tab not found. Please refresh the page to reset layout.",
        );
        // Clear saved layout to force reset on next load
        localStorage.removeItem("puzzlescript_layout");
      }
    }
  }, [addConsoleMessage]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toolbar
        onAction={handleToolbarAction}
        onOpenThemeEditor={handleOpenThemeEditor}
      />

      <div className="flex-1 overflow-hidden">
        <DockLayout
          ref={layoutRef}
          codeEditor={
            <CodeEditor initialCode={code} onChange={handleCodeChange} />
          }
          gameCanvas={<GameCanvas onCanvasReady={handleCanvasReady} />}
          console={
            <Console
              messages={consoleMessages}
              onAction={handleConsoleAction}
            />
          }
          themeEditor={<ThemeEditor />}
        />
      </div>
    </div>
  );
}
