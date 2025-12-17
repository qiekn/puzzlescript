"use client";

import { useState, useEffect } from "react";
import * as FlexLayout from "flexlayout-react";
import Toolbar from "@/components/Toolbar";
import CodeEditor from "@/components/CodeEditor";
import GameCanvas from "@/components/GameCanvas";
import Console from "@/components/Console";
import ThemeEditor from "@/components/ThemeEditor";
import DockLayout from "@/components/DockLayout";

export default function EditorPage() {
  const [code, setCode] = useState("");
  const [consoleMessages, setConsoleMessages] = useState([]);

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

  const addConsoleMessage = (message) => {
    setConsoleMessages((prev) => [...prev, message]);
  };

  const handleToolbarAction = (action) => {
    console.log("Toolbar action:", action);
    addConsoleMessage(`Action: ${action}`);
  };

  const handleConsoleAction = (action) => {
    console.log("Console action:", action);

    switch (action) {
      case "clearConsole":
        setConsoleMessages([]);
        break;
      default:
        addConsoleMessage(`Console action: ${action}`);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toolbar onAction={handleToolbarAction} />

      <div className="flex-1 overflow-hidden">
        <DockLayout
          codeEditor={
            <CodeEditor initialCode={code} onChange={handleCodeChange} />
          }
          gameCanvas={<GameCanvas />}
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
