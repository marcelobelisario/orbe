import {createContext, useContext, useState, type PropsWithChildren} from "react";
import {darkColors, lightColors, type ThemeColors} from "./tokens";

export type ColorTheme = "light" | "dark";
type ThemeContextValue = {
  colors: ThemeColors;
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({children}: PropsWithChildren) {
  const [theme, setTheme] = useState<ColorTheme>("dark");
  return (
    <ThemeContext.Provider
      value={{colors: theme === "dark" ? darkColors : lightColors, theme, setTheme}}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  return value;
}
