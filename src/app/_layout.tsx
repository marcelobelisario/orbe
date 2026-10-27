import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {ValueVisibilityProvider} from "@/contexts/valueVisibility";

import {ThemeProvider, useTheme} from "@/theme/themeProvider";
import {useComponentFonts} from "@/theme/useComponentFonts";

function Navigation() {
  const {colors, theme} = useTheme();
  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          contentStyle: {backgroundColor: colors.background},
          headerStyle: {backgroundColor: colors.surface},
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen name="index" options={{title: "Entrar", headerShown: false}} />
        <Stack.Screen name="dashboard" options={{title: "Dashboard", headerShown: false}} />
        <Stack.Screen name="statement" options={{title: "Extrato"}} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useComponentFonts();
  if (error) throw error;
  if (!loaded) return null;
  return (
    <ThemeProvider>
      <ValueVisibilityProvider>
        <Navigation />
      </ValueVisibilityProvider>
    </ThemeProvider>
  );
}
