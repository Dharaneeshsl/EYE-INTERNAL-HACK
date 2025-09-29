import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const darkMode = true;
  return (
    <ThemeContext.Provider value={{ darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
