import { useEffect, useMemo, useState } from "react";
import ThemeContext from "./theme";

const STORAGE_KEY = "topg-auto-seat-theme";

function getInitialTheme() {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Theme selection still works when browser storage is unavailable.
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme: () => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark") }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}