"use client";

import { useEffect, useRef } from "react";

export default function GameCanvas({ onCanvasReady }) {
  const canvasRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only call onCanvasReady once when canvas is first available
    if (canvasRef.current && onCanvasReady && !initializedRef.current) {
      initializedRef.current = true;
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
        }}
      />
    </div>
  );
}
