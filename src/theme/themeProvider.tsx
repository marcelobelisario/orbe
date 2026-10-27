import { createContext, useContext, useMemo, useState, useSyncExternalStore, type PropsWithChildren } from "react";
import { useColorScheme } from "react-native";

import { darkColors, lightColors, type ThemeColors } from "./tokens";

export type ThemePreference = "system" | "light" | "dark";
export type ColorTheme = "light" | "dark";

type ThemeContextValue = {
  colors: ThemeColors;
  theme: ColorTheme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const subscribeToHydration = () => () => {};

export function ThemeProvider({
                                children,
                                initialPreference = "system"
}: PropsWithChildren<{ initialPreference?: ThemePreference }>) {
  const systemTheme = useColorScheme();

  // Web SSR and the first client render share a palette before reading the device.
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);
  const theme = preference === "system" ? (hydrated ? systemTheme ?? "light" : "light") : preference;

  const value = useMemo<ThemeContextValue>(() => ({
    colors: theme === "dark" ? darkColors : lightColors,
    theme,
    preference,
    setPreference,
  }), [preference, theme]);
  // console.log(value)
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  return value;
}
