'use client'

import { useRef, useCallback } from 'react'
import * as FlexLayout from 'flexlayout-react'
import 'flexlayout-react/style/dark.css'

export default function DockLayout({
  codeEditor,
  gameCanvas,
  console,
  onLayoutChange
}) {
  const layoutRef = useRef(null)

  // Define the initial layout model
  const defaultLayout = {
    global: {
      tabEnableClose: false,
      tabEnableRename: false,
      tabSetEnableMaximize: true,
      tabSetEnableTabStrip: true,
      tabSetHeaderHeight: 28,
      tabSetTabStripHeight: 28,
      borderBarSize: 32,
      borderEnableDrop: true,
    },
    borders: [],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          weight: 40,
          children: [
            {
              type: 'tab',
              name: 'Code Editor',
              component: 'codeEditor',
            },
          ],
        },
        {
          type: 'column',
          weight: 60,
          children: [
            {
              type: 'tabset',
              weight: 70,
              children: [
                {
                  type: 'tab',
                  name: 'Game Canvas',
                  component: 'gameCanvas',
                },
              ],
            },
            {
              type: 'tabset',
              weight: 30,
              children: [
                {
                  type: 'tab',
                  name: 'Console',
                  component: 'console',
                },
              ],
            },
          ],
        },
      ],
    },
  }

  // Load saved layout from localStorage or use default
  const getInitialModel = () => {
    if (typeof window !== 'undefined') {
      const savedLayout = localStorage.getItem('puzzlescript_layout')
      if (savedLayout) {
        try {
          return FlexLayout.Model.fromJson(JSON.parse(savedLayout))
        } catch (e) {
          console.error('Failed to load saved layout:', e)
        }
      }
    }
    return FlexLayout.Model.fromJson(defaultLayout)
  }

  const modelRef = useRef(getInitialModel())
  const model = modelRef.current

  // Factory function to render components
  const factory = (node) => {
    const component = node.getComponent()

    switch (component) {
      case 'codeEditor':
        return codeEditor
      case 'gameCanvas':
        return gameCanvas
      case 'console':
        return console
      default:
        return <div>Unknown component: {component}</div>
    }
  }

  // Save layout when it changes
  const handleModelChange = useCallback((model) => {
    if (typeof window !== 'undefined') {
      const json = model.toJson()
      localStorage.setItem('puzzlescript_layout', JSON.stringify(json))
      if (onLayoutChange) {
        onLayoutChange(json)
      }
    }
  }, [onLayoutChange])

  return (
    <div className="flex-1 h-full w-full relative">
      <style jsx global>{`
        .flexlayout__layout {
          background: #1a1a2e;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .flexlayout__tabset {
          background: #16213e;
        }

        .flexlayout__tabset_header {
          background: #0f3460;
          border-bottom: 1px solid #1a1a2e;
        }

        .flexlayout__tab {
          background: #0f3460;
          color: #ffffff;
          border: none;
        }

        .flexlayout__tab:hover {
          background: #e94560;
        }

        .flexlayout__tab_button--selected {
          background: #16213e !important;
          color: #ffffff;
        }

        .flexlayout__splitter {
          background: #0f3460;
        }

        .flexlayout__splitter:hover {
          background: #e94560;
        }

        .flexlayout__splitter_drag {
          background: #e94560;
        }

        .flexlayout__tab_button_content {
          color: #ffffff;
        }

        .flexlayout__border_button {
          background: #0f3460;
          color: #ffffff;
        }

        .flexlayout__border_button:hover {
          background: #e94560;
        }

        .flexlayout__border_button--selected {
          background: #16213e;
        }

        .flexlayout__tabset_tabbar_outer {
          background: #0f3460;
        }

        .flexlayout__tabset_content {
          background: #1a1a2e;
        }

        .flexlayout__popup_menu {
          background: #16213e;
          border: 1px solid #0f3460;
        }

        .flexlayout__popup_menu_item {
          color: #ffffff;
        }

        .flexlayout__popup_menu_item:hover {
          background: #e94560;
        }
      `}</style>

      <FlexLayout.Layout
        ref={layoutRef}
        model={model}
        factory={factory}
        onModelChange={handleModelChange}
      />
    </div>
  )
}
