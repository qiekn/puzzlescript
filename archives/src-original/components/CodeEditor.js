'use client'

import { useEffect, useRef, useState } from 'react'

export default function CodeEditor({ initialCode = '', onChange }) {
  const textareaRef = useRef(null)
  const [code, setCode] = useState(initialCode)

  useEffect(() => {
    // Initialize CodeMirror here when the component mounts
    // For now, we'll use a simple textarea
    // TODO: Integrate CodeMirror or a React code editor like react-codemirror
    if (textareaRef.current) {
      textareaRef.current.value = initialCode
    }
  }, [initialCode])

  const handleChange = (e) => {
    const newCode = e.target.value
    setCode(newCode)
    if (onChange) {
      onChange(newCode)
    }
  }

  return (
    <div className="w-full h-full bg-puzzlescript-bg">
      <textarea
        ref={textareaRef}
        id="code"
        className="w-full h-full p-4 bg-puzzlescript-bg text-white font-mono text-sm resize-none focus:outline-none border-none"
        value={code}
        onChange={handleChange}
        spellCheck={false}
        placeholder="( starter script goes here )"
      />
    </div>
  )
}
