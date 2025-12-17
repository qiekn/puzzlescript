"use client";

import { useRef } from "react";

export default function GameCanvas() {
  const canvasRef = useRef(null);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <canvas
        id="gameCanvas"
        ref={canvasRef}
        className="max-w-full max-h-full"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
