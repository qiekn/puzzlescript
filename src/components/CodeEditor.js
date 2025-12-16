"use client";

import { useEffect, useRef, useState } from "react";

export default function CodeEditor({ initialCode = "", onChange }) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [code, setCode] = useState(initialCode);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = initialCode;
    }
  }, [initialCode]);

  useEffect(() => {
    // Update line count when code changes
    const lines = code.split("\n").length;
    setLineCount(lines);
  }, [code]);

  const handleChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  const handleScroll = (e) => {
    // Sync line numbers scroll with textarea scroll
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className="w-full h-full flex">
      {/* Line numbers */}
      <div
        ref={lineNumbersRef}
        className="font-mono text-sm select-none overflow-hidden"
        style={{
          color: "var(--color-lineNumber)",
          borderRight: "1px solid var(--color-border)",
          minWidth: "3rem",
          textAlign: "right",
          paddingTop: "0.5rem",
          paddingRight: "0.5rem",
          paddingLeft: "0.5rem",
          lineHeight: "1.5",
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code textarea */}
      <textarea
        ref={textareaRef}
        id="code"
        className="flex-1 h-full font-mono text-sm resize-none focus:outline-none border-none"
        style={{
          backgroundColor: "transparent",
          color: "var(--color-text)",
          lineHeight: "1.5",
          padding: "0.5rem",
        }}
        value={code}
        onChange={handleChange}
        onScroll={handleScroll}
        spellCheck={false}
        placeholder="( starter script goes here )"
      />
    </div>
  );
}
