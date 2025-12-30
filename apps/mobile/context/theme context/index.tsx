import { useColorScheme } from 'nativewind';
import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react';

interface ThemeContextProps {
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined,
);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
    const colorScheme = useColorScheme();

  const toggleTheme = () => colorScheme.toggleColorScheme()

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
