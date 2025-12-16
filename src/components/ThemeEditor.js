"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeEditor() {
  const { theme, currentTheme, updateCustomTheme } = useTheme();
  const [customColors, setCustomColors] = useState({});
  const [originalColors, setOriginalColors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (theme && theme.colors) {
      setCustomColors({ ...theme.colors });
      setOriginalColors({ ...theme.colors });
    }
  }, [theme]);

  const handleColorChange = (key, value) => {
    const newColors = {
      ...customColors,
      [key]: value,
    };
    setCustomColors(newColors);
    setIsEditing(true);

    // Real-time preview: apply colors immediately
    const root = document.documentElement;
    root.style.setProperty(`--color-${key}`, value);
  };

  const handleSave = () => {
    if (updateCustomTheme) {
      updateCustomTheme(customColors);
      setOriginalColors({ ...customColors });
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    setCustomColors({ ...originalColors });
    setIsEditing(false);

    // Restore original colors
    const root = document.documentElement;
    Object.entries(originalColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  };

  const colorGroups = {
    Background: ["bg", "bgSecondary", "bgTertiary", "panel"],
    Text: ["text", "textSecondary", "textMuted", "lineNumber"],
    Accent: ["accent", "accentHover", "highlight"],
    Status: ["success", "warning", "error"],
    Special: ["cyan", "purple", "orange"],
    UI: ["border", "selection"],
    Scrollbar: ["scrollbarTrack", "scrollbarThumb", "scrollbarThumbHover"],
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header with action buttons */}
      <div
        className="px-4 py-2 border-b flex items-center justify-between"
        style={{
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-textSecondary)" }}
          >
            Editing: {theme?.name || currentTheme}
          </span>
          {isEditing && (
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                backgroundColor: "var(--color-warning)",
                color: "var(--color-bg)",
              }}
            >
              Unsaved
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={!isEditing}
            className="px-3 py-1 rounded text-sm transition-opacity disabled:opacity-30 flex items-center gap-1.5"
            style={{
              backgroundColor: "var(--color-bgSecondary)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
            title="Reset to original colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!isEditing}
            className="px-3 py-1 rounded text-sm transition-opacity disabled:opacity-30 flex items-center gap-1.5"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-text)",
            }}
            title="Save changes to current theme"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>

      {/* Content - scrollable color groups */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
            <div key={groupName}>
              <h3
                className="text-sm font-semibold mb-3 uppercase tracking-wide"
                style={{ color: "var(--color-textMuted)" }}
              >
                {groupName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {colorKeys.map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 p-2 rounded"
                    style={{
                      backgroundColor: "var(--color-bgSecondary)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <input
                      type="color"
                      value={customColors[key] || "#000000"}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border"
                      style={{ borderColor: "var(--color-border)" }}
                      title={`Pick color for ${key}`}
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        className="block text-xs font-medium mb-1"
                        style={{ color: "var(--color-textSecondary)" }}
                      >
                        {key}
                      </label>
                      <input
                        type="text"
                        value={customColors[key] || ""}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-full px-2 py-1 rounded text-xs font-mono"
                        style={{
                          backgroundColor: "var(--color-bg)",
                          color: "var(--color-text)",
                          border: "1px solid var(--color-border)",
                        }}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
