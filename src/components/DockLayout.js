"use client";

import { useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import * as FlexLayout from "flexlayout-react";
import "flexlayout-react/style/dark.css";

const DockLayout = forwardRef(function DockLayout(
  { codeEditor, gameCanvas, console, themeEditor, onLayoutChange },
  ref,
) {
  const layoutRef = useRef(null);

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
      splitterSize: 8,
    },
    borders: [],
    layout: {
      type: "row",
      weight: 100,
      children: [
        {
          type: "tabset",
          weight: 40,
          children: [
            {
              type: "tab",
              name: "Code Editor",
              component: "codeEditor",
              enableClose: false,
            },
            {
              type: "tab",
              name: "Theme Editor",
              component: "themeEditor",
              enableClose: true,
            },
          ],
        },
        {
          type: "column",
          weight: 60,
          children: [
            {
              type: "tabset",
              weight: 70,
              children: [
                {
                  type: "tab",
                  name: "Game Canvas",
                  component: "gameCanvas",
                  enableClose: false,
                },
              ],
            },
            {
              type: "tabset",
              weight: 30,
              children: [
                {
                  type: "tab",
                  name: "Console",
                  component: "console",
                  enableClose: false,
                },
              ],
            },
          ],
        },
      ],
    },
  };

  // Load saved layout from localStorage or use default
  const getInitialModel = () => {
    if (typeof window !== "undefined") {
      const savedLayout = localStorage.getItem("puzzlescript_layout");
      if (savedLayout) {
        try {
          return FlexLayout.Model.fromJson(JSON.parse(savedLayout));
        } catch (e) {
          console.error("Failed to load saved layout:", e);
        }
      }
    }
    return FlexLayout.Model.fromJson(defaultLayout);
  };

  const modelRef = useRef(getInitialModel());
  const model = modelRef.current;

  useImperativeHandle(ref, () => ({
    getModel: () => modelRef.current,
  }));

  // Factory function to render components
  const factory = (node) => {
    const component = node.getComponent();

    switch (component) {
      case "codeEditor":
        return codeEditor;
      case "gameCanvas":
        return gameCanvas;
      case "console":
        return console;
      case "themeEditor":
        return themeEditor;
      default:
        return <div>Unknown component: {component}</div>;
    }
  };

  // Save layout when it changes
  const handleModelChange = useCallback(
    (model) => {
      if (typeof window !== "undefined") {
        const json = model.toJson();
        localStorage.setItem("puzzlescript_layout", JSON.stringify(json));
        if (onLayoutChange) {
          onLayoutChange(json);
        }
      }
    },
    [onLayoutChange],
  );

  return (
    <div className="flex-1 h-full w-full relative">
      <style jsx global>{`
        .flexlayout__layout {
          background: var(--color-bg);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .flexlayout__tabset {
          background: transparent;
          border: none !important;
          outline: none !important;
          padding: 8px;
        }

        .flexlayout__tabset_header {
          background: transparent;
          border: none !important;
          outline: none !important;
          padding: 0;
        }

        .flexlayout__tab {
          background: transparent;
          color: var(--color-textMuted);
          border: none;
          border-radius: 0;
          margin-right: 0;
          position: relative;
          padding: 3px 0px;
        }

        .flexlayout__tab:hover {
          color: var(--color-text);
        }

        .flexlayout__tab_button--selected {
          background: transparent !important;
          color: var(--color-text);
          border-bottom: 2px solid var(--color-accent) !important;
        }

        .flexlayout__splitter {
          background: transparent;
          border: none;
        }

        .flexlayout__splitter:hover {
          background: transparent;
        }

        .flexlayout__splitter_drag {
          background: var(--color-accent);
          opacity: 0.5;
        }

        .flexlayout__tab_button_content {
          color: var(--color-text);
        }

        .flexlayout__border_button {
          background: var(--color-bgTertiary);
          color: var(--color-text);
        }

        .flexlayout__border_button:hover {
          background: var(--color-accentHover);
        }

        .flexlayout__border_button--selected {
          background: var(--color-accent);
        }

        .flexlayout__tabset_tabbar_outer {
          background: var(--color-bgTertiary);
          border-radius: 8px 8px 0 0;
        }

        .flexlayout__tabset_content {
          background: var(--color-bgTertiary);
          border: none !important;
          border-radius: 0 0 8px 8px !important;
          overflow: hidden;
        }

        .flexlayout__tabset-selected {
          border: none !important;
          outline: none !important;
        }

        .flexlayout__tabset-selected .flexlayout__tabset_content {
          border: none !important;
          outline: none !important;
        }

        .flexlayout__tabset-selected .flexlayout__tabset_header {
          border: none !important;
          outline: none !important;
        }

        .flexlayout__border {
          border: none !important;
          outline: none !important;
        }

        .flexlayout__tabset_header_outer {
          border: none !important;
          outline: none !important;
        }

        .flexlayout__tabset_tabbar_outer_top {
          border: none !important;
          outline: none !important;
        }

        .flexlayout__tabset_header_inner {
          border: none !important;
          outline: none !important;
        }

        .flexlayout__popup_menu {
          background: var(--color-panel);
          border: 1px solid var(--color-border);
        }

        .flexlayout__popup_menu_item {
          color: var(--color-text);
        }

        .flexlayout__popup_menu_item:hover {
          background: var(--color-accentHover);
        }
      `}</style>

      <FlexLayout.Layout
        ref={layoutRef}
        model={model}
        factory={factory}
        onModelChange={handleModelChange}
      />
    </div>
  );
});

export default DockLayout;
