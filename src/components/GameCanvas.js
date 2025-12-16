"use client";

import { useEffect, useRef } from "react";

export default function GameCanvas({ onCanvasReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && onCanvasReady) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <canvas
        id="gameCanvas"
        ref={canvasRef}
        className="max-w-full max-h-full"
        style={{
          imageRendering: "pixelated",
          imageRendering: "-moz-crisp-edges",
          imageRendering: "-webkit-crisp-edges",
          imageRendering: "crisp-edges",
        }}
      />
    </div>
  );
}
