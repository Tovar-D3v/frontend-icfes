"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Por defecto siempre en dark
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme !== null) {
        const dark = savedTheme === "dark";
        setIsDarkMode(dark);
        document.documentElement.classList.toggle("dark", dark);
      } else {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    } catch (e) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    document.documentElement.classList.toggle("dark", newTheme);
    try {
      localStorage.setItem("theme", newTheme ? "dark" : "light");
    } catch (e) {
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}