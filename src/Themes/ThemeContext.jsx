// src/style/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { themes } from './themeConfig';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('leet');

  // Memoize theme classes to prevent unnecessary recalculations
  const themeClasses = useMemo(() => themes[currentTheme], [currentTheme]);


  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Change theme handler
   const changeTheme = (themeName) => {
    if (themes[themeName] && themeName !== currentTheme) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);
      document.documentElement.setAttribute('data-theme', themeName);
    }
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentTheme,
    themeClasses,
     changeTheme
  }), [currentTheme, themeClasses]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};