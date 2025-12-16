'use client'

import { useEffect, useRef, useState } from 'react'

export default function CodeEditor({ initialCode = '', onChange }) {
  const textareaRef = useRef(null)
  const lineNumbersRef = useRef(null)
  const [code, setCode] = useState(initialCode)
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = initialCode
    }
  }, [initialCode])

  useEffect(() => {
    // Update line count when code changes
    const lines = code.split('\n').length
    setLineCount(lines)
  }, [code])

  const handleChange = (e) => {
    const newCode = e.target.value
    setCode(newCode)
    if (onChange) {
      onChange(newCode)
    }
  }

  const handleScroll = (e) => {
    // Sync line numbers scroll with textarea scroll
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop
    }
  }

  return (
    <div className="w-full h-full bg-puzzlescript-bg flex">
      {/* Line numbers */}
      <div
        ref={lineNumbersRef}
        className="bg-puzzlescript-bg text-gray-500 font-mono text-sm py-4 pr-2 pl-4 select-none overflow-hidden"
        style={{
          borderRight: '1px solid #444',
          minWidth: '3.5rem',
          textAlign: 'right'
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1} style={{ lineHeight: '1.5' }}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code textarea */}
      <textarea
        ref={textareaRef}
        id="code"
        className="flex-1 h-full py-4 px-2 bg-puzzlescript-bg text-white font-mono text-sm resize-none focus:outline-none border-none"
        style={{ lineHeight: '1.5' }}
        value={code}
        onChange={handleChange}
        onScroll={handleScroll}
        spellCheck={false}
        placeholder="( starter script goes here )"
      />
    </div>
  )
}
