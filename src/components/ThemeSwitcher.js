"use client";

import { Palette, Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeSwitcher({ onOpenThemeEditor }) {
  const { currentTheme, themes, switchTheme, deleteCustomTheme } = useTheme();

  const currentThemeData = themes.find((t) => t.id === currentTheme);

  const handleDelete = () => {
    if (currentThemeData?.isCustom) {
      if (confirm(`Delete custom theme "${currentThemeData.name}"?`)) {
        deleteCustomTheme(currentTheme);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className="text-sm"
        style={{ color: "var(--color-textSecondary)" }}
      >
        Theme:
      </span>
      <select
        value={currentTheme}
        onChange={(e) => switchTheme(e.target.value)}
        className="px-2 py-1 rounded text-sm cursor-pointer"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
        }}
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
      <button
        onClick={onOpenThemeEditor}
        className="px-2 py-1 rounded text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
        }}
        title="Customize theme colors"
      >
        <Palette size={14} />
        Edit
      </button>
      {currentThemeData?.isCustom && (
        <button
          onClick={handleDelete}
          className="px-2 py-1 rounded text-sm hover:opacity-80 transition-opacity flex items-center"
          style={{
            backgroundColor: "var(--color-error)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
          }}
          title="Delete custom theme"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
