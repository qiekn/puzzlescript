'use client'

import { useState, useRef, useEffect } from 'react'

export default function SplitPane({
  left,
  right,
  initialLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  direction = 'horizontal' // 'horizontal' or 'vertical'
}) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()

      if (direction === 'horizontal') {
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
        setLeftWidth(Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth))
      } else {
        const newLeftWidth = ((e.clientY - containerRect.top) / containerRect.height) * 100
        setLeftWidth(Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth))
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, direction, minLeftWidth, maxLeftWidth])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  if (direction === 'horizontal') {
    return (
      <div ref={containerRef} className="flex h-full w-full">
        <div style={{ width: `${leftWidth}%` }} className="h-full overflow-hidden">
          {left}
        </div>
        <div
          className="w-1 bg-puzzlescript-accent hover:bg-puzzlescript-highlight cursor-col-resize flex-shrink-0"
          onMouseDown={handleMouseDown}
        />
        <div style={{ width: `${100 - leftWidth}%` }} className="h-full overflow-hidden">
          {right}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full">
      <div style={{ height: `${leftWidth}%` }} className="w-full overflow-hidden">
        {left}
      </div>
      <div
        className="h-1 bg-puzzlescript-accent hover:bg-puzzlescript-highlight cursor-row-resize flex-shrink-0"
        onMouseDown={handleMouseDown}
      />
      <div style={{ height: `${100 - leftWidth}%` }} className="w-full overflow-hidden">
        {right}
      </div>
    </div>
  )
}
