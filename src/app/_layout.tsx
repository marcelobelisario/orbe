import {ValueVisibilityProvider} from "@/contexts/valueVisibility";
import {TransactionsProvider} from "@/contexts/transactions";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";

import {ThemeProvider, useTheme} from "@/theme/themeProvider";
import {useComponentFonts} from "@/theme/useComponentFonts";
import LoadingAppState from "@/states/loadingAppState";
import {ErrorState} from "@/components/errorState";

function Navigation() {
    const {colors, theme} = useTheme();
    const [loaded, error] = useComponentFonts();
    if (error)
        return (
            <ErrorState
                title="Não foi possível iniciar"
                message="Reabra o aplicativo para carregar os recursos locais."
            />
        );
    if (!loaded) return <LoadingAppState/>;
    return (
        <>
            <StatusBar style={theme === "dark" ? "light" : "dark"}/>
            <Stack
                screenOptions={{
                    contentStyle: {backgroundColor: colors.background},
                    headerStyle: {backgroundColor: colors.surface},
                    headerTintColor: colors.text,
                }}
            >
                <Stack.Screen name="index" options={{title: "Entrar", headerShown: false}}/>
                <Stack.Screen name="dashboard" options={{title: "Dashboard", headerShown: false}}/>
                <Stack.Screen name="register" options={{headerShown: false}}/>
                <Stack.Screen name="demo" options={{headerShown: false}}/>
                <Stack.Screen name="loading" options={{headerShown: false}}/>
                <Stack.Screen name="statement" options={{title: "Extrato"}}/>
                <Stack.Screen name="new-entry/select" options={{headerShown: false}}/>
                <Stack.Screen name="new-entry/income" options={{headerShown: false}}/>
                <Stack.Screen name="new-entry/expense" options={{headerShown: false}}/>
                <Stack.Screen name="error" options={{title: "Erro", headerShown: false}}/>
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <ValueVisibilityProvider>
                <TransactionsProvider>
                    <Navigation/>
                </TransactionsProvider>
            </ValueVisibilityProvider>
        </ThemeProvider>
    );
}
