"use client";

import { createContext, useContext, useState, useEffect } from "react";

const themes = {
  "tokyo-night": {
    name: "Tokyo Night",
    colors: {
      bg: "#1a1b26",
      bgSecondary: "#16161e",
      bgTertiary: "#24283b",
      panel: "#1f2335",
      border: "#414868",
      text: "#c0caf5",
      textSecondary: "#a9b1d6",
      textMuted: "#565f89",
      accent: "#565f89",
      accentHover: "#7aa2f7",
      highlight: "#f7768e",
      success: "#9ece6a",
      warning: "#e0af68",
      error: "#f7768e",
      cyan: "#7dcfff",
      purple: "#bb9af7",
      orange: "#ff9e64",
      selection: "#364a82",
      lineNumber: "#565f89",
      scrollbarTrack: "#24283b",
      scrollbarThumb: "#414868",
      scrollbarThumbHover: "#7aa2f7",
    },
  },
  "tokyo-night-storm": {
    name: "Tokyo Night Storm",
    colors: {
      bg: "#24283b",
      bgSecondary: "#1f2335",
      bgTertiary: "#292e42",
      panel: "#1f2335",
      border: "#414868",
      text: "#c0caf5",
      textSecondary: "#a9b1d6",
      textMuted: "#565f89",
      accent: "#565f89",
      accentHover: "#7aa2f7",
      highlight: "#f7768e",
      success: "#9ece6a",
      warning: "#e0af68",
      error: "#f7768e",
      cyan: "#7dcfff",
      purple: "#bb9af7",
      orange: "#ff9e64",
      selection: "#364a82",
      lineNumber: "#565f89",
      scrollbarTrack: "#292e42",
      scrollbarThumb: "#414868",
      scrollbarThumbHover: "#7aa2f7",
    },
  },
  "tokyo-night-day": {
    name: "Tokyo Night Day",
    colors: {
      bg: "#d5d6db",
      bgSecondary: "#e9e9ec",
      bgTertiary: "#dfe0e5",
      panel: "#e9e9ec",
      border: "#a8aecb",
      text: "#1a1b26",
      textSecondary: "#343b58",
      textMuted: "#4c505e",
      accent: "#9699a3",
      accentHover: "#2e7de9",
      highlight: "#f52a65",
      success: "#587539",
      warning: "#8c6c3e",
      error: "#f52a65",
      cyan: "#007197",
      purple: "#5a4a78",
      orange: "#b15c00",
      selection: "#b6bfe2",
      lineNumber: "#565f89",
      scrollbarTrack: "#dfe0e5",
      scrollbarThumb: "#a8aecb",
      scrollbarThumbHover: "#2e7de9",
    },
  },
  puzzlescript: {
    name: "PuzzleScript Classic",
    colors: {
      bg: "#1a1a2e",
      bgSecondary: "#16213e",
      bgTertiary: "#0f3460",
      panel: "#16213e",
      border: "#0f3460",
      text: "#ffffff",
      textSecondary: "#e0e0e0",
      textMuted: "#9ca3af",
      accent: "#1e4976",
      accentHover: "#2563a8",
      highlight: "#e94560",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      cyan: "#06b6d4",
      purple: "#8b5cf6",
      orange: "#f97316",
      selection: "#0f3460",
      lineNumber: "#6b7280",
      scrollbarTrack: "#0f3460",
      scrollbarThumb: "#0f3460",
      scrollbarThumbHover: "#e94560",
    },
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState("tokyo-night");
  const [customThemes, setCustomThemes] = useState({});

  useEffect(() => {
    // Load saved theme and custom themes from localStorage
    const savedTheme = localStorage.getItem("puzzlescript_theme");
    const savedCustomThemes = localStorage.getItem(
      "puzzlescript_custom_themes",
    );

    if (savedCustomThemes) {
      try {
        setCustomThemes(JSON.parse(savedCustomThemes));
      } catch (e) {
        console.error("Failed to load custom themes:", e);
      }
    }

    if (savedTheme && (themes[savedTheme] || savedCustomThemes)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme CSS variables
    const theme = customThemes[currentTheme] || themes[currentTheme];
    if (!theme) return;

    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Save to localStorage
    localStorage.setItem("puzzlescript_theme", currentTheme);
  }, [currentTheme, customThemes]);

  const switchTheme = (themeName) => {
    if (themes[themeName] || customThemes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const updateCustomTheme = (colors) => {
    // If editing a built-in theme, create a custom version
    if (themes[currentTheme]) {
      const customThemeName = `${currentTheme}-custom`;
      const newCustomTheme = {
        name: `${themes[currentTheme].name} (Custom)`,
        colors: colors,
      };

      const updatedCustomThemes = {
        ...customThemes,
        [customThemeName]: newCustomTheme,
      };

      setCustomThemes(updatedCustomThemes);
      localStorage.setItem(
        "puzzlescript_custom_themes",
        JSON.stringify(updatedCustomThemes),
      );
      setCurrentTheme(customThemeName);
    } else {
      // If editing a custom theme, update it directly
      const updatedCustomThemes = {
        ...customThemes,
        [currentTheme]: {
          ...customThemes[currentTheme],
          colors: colors,
        },
      };

      setCustomThemes(updatedCustomThemes);
      localStorage.setItem(
        "puzzlescript_custom_themes",
        JSON.stringify(updatedCustomThemes),
      );
    }
  };

  const deleteCustomTheme = (themeName) => {
    const updatedCustomThemes = { ...customThemes };
    delete updatedCustomThemes[themeName];

    setCustomThemes(updatedCustomThemes);
    localStorage.setItem(
      "puzzlescript_custom_themes",
      JSON.stringify(updatedCustomThemes),
    );

    if (currentTheme === themeName) {
      setCurrentTheme("tokyo-night");
    }
  };

  const allThemes = [
    ...Object.keys(themes).map((key) => ({
      id: key,
      name: themes[key].name,
      isCustom: false,
    })),
    ...Object.keys(customThemes).map((key) => ({
      id: key,
      name: customThemes[key].name,
      isCustom: true,
    })),
  ];

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        theme: customThemes[currentTheme] || themes[currentTheme],
        themes: allThemes,
        switchTheme,
        updateCustomTheme,
        deleteCustomTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
