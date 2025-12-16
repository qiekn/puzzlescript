"use client";

import { useState } from "react";
import Image from "next/image";
import { Volume2 } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Console({ messages = [], onAction }) {
  const [showLayers, setShowLayers] = useState(false);
  const [verboseLogging, setVerboseLogging] = useState(false);
  const [debugLogging, setDebugLogging] = useState(false);

  const handleAction = (action) => {
    if (onAction) {
      onAction(action);
    }
  };

  // prettier-ignore
  const soundButtons = [
    { id: "newsound0", title: "collect item sound",  icon: "audio1.png"  },
    { id: "newsound7", title: "push sounds",         icon: "audio2.png"  },
    { id: "newsound2", title: "explosion sound",     icon: "audio3.png"  },
    { id: "newsound3", title: "powerup sound",       icon: "audio4.png"  },
    { id: "newsound9", title: "bird tweet sound",    icon: "audio5.png"  },
    { id: "newsound4", title: "hurt sound",          icon: "audio6.png"  },
    { id: "newsound5", title: "jump sound",          icon: "audio7.png"  },
    { id: "newsound1", title: "pew pew sound",       icon: "audio8.png"  },
    { id: "newsound6", title: "selection sound",     icon: "audio9.png"  },
    { id: "newsound8", title: "random sound",        icon: "audio10.png" },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: "var(--color-bgTertiary)",
        border: "none",
        borderRadius: "0",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        className="px-4 py-2 flex items-center gap-3 flex-wrap"
        style={{
          backgroundColor: "var(--color-accent)",
        }}
      >
        <button
          onClick={() => handleAction("clearConsole")}
          className="hover:opacity-80 transition-opacity"
          title="clear the console"
        >
          <Image
            src={`${basePath}/images/close-window.png`}
            alt="Clear"
            width={16}
            height={16}
          />
        </button>

        <button
          onClick={() => {
            setVerboseLogging(!verboseLogging);
            handleAction("verboseLogging");
          }}
          className={`hover:opacity-80 transition-opacity ${verboseLogging ? "opacity-100" : "opacity-50"}`}
          title="toggle verbose logging"
        >
          <Image
            src={`${basePath}/images/megaphone.png`}
            alt="Verbose"
            width={16}
            height={16}
          />
        </button>

        <button
          onClick={() => {
            setDebugLogging(!debugLogging);
            handleAction("debugLogging");
          }}
          className={`hover:opacity-80 transition-opacity ${debugLogging ? "opacity-100" : "opacity-50"}`}
          title="toggle compiler debug mode"
        >
          <Image src={`${basePath}/images/doc.png`} alt="Debug" width={16} height={16} />
        </button>

        <button
          onClick={() => {
            setShowLayers(!showLayers);
            handleAction("showLayers");
          }}
          className={`hover:opacity-80 transition-opacity ${showLayers ? "opacity-100" : "opacity-50"}`}
          title="toggle show layers"
        >
          <Image src={`${basePath}/images/layers.png`} alt="Layers" width={16} height={16} />
        </button>

        <button
          onClick={() => handleAction("runProgram")}
          className="hover:opacity-80 transition-opacity"
          title="run program"
        >
          <Image src={`${basePath}/images/run.png`} alt="Run" width={16} height={16} />
        </button>

        <button
          onClick={() => handleAction("makeGif")}
          className="hover:opacity-80 transition-opacity"
          title="make GIF"
        >
          <Image src={`${basePath}/images/gif.png`} alt="GIF" width={16} height={16} />
        </button>

        <button
          onClick={() => handleAction("gotoLevelAll")}
          className="hover:opacity-80 transition-opacity"
          title="make level all objects"
        >
          <Image
            src={`${basePath}/images/checkerboard.png`}
            alt="Level All"
            width={16}
            height={16}
          />
        </button>

        <span className="text-gray-500">|</span>

        {/* Sound buttons */}
        {soundButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleAction(btn.id)}
            className="hover:opacity-80 transition-opacity"
            title={btn.title}
          >
            <Image
              src={`${basePath}/images/${btn.icon}`}
              alt={btn.title}
              width={16}
              height={16}
            />
          </button>
        ))}
      </div>

      {/* Console output */}
      <div
        className="flex-1 overflow-auto p-4 font-mono text-sm custom-scrollbar"
        style={{
          backgroundColor: "var(--color-bgSecondary)",
          color: "var(--color-success)",
        }}
      >
        <div className="whitespace-pre-wrap">
          ======================================
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PuzzleScript Next Console
          <br />
          &nbsp;&nbsp;&nbsp;React Edition
          <br />
          <br />
          Thank you for using PuzzleScript Next!
          <br />
          <br />
          Please see the{" "}
          <a
            href="https://github.com/david-pfx/PuzzleScriptNext"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            README
          </a>{" "}
          for more
          <br />
          information about this release.
          <br />
          ======================================
          <br />
          <br />
          {messages.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
