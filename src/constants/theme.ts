import { useColorScheme } from "react-native";

/**
 * Representa a estrutura de cores padrão utilizada em todo o design system do app.
 */
export type Theme = {
    background: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
    income: string;
    expense: string;
    disabled: string;
    inputBackground: string;
    incomeSurface: string;
    expenseSurface: string;
}

/**
 *  Modos de temas suportados pela aplicação 
 */
export type ThemeMode = "light" | "dark";

/**
 * Mapeamento das paletas de cores por modo
 */
export const themes: Record<ThemeMode,Theme> = {
    dark: {
        background: "#0B0D12",
        surface: "#151821",
        border: "#252B3A",
        text: "#F1F3F9",
        muted: "#7F8BA8",
        income: "#10B7A5",
        expense: "#F43F68",
        disabled: "#202536",
        inputBackground: "#151821",
        incomeSurface: "#0C1B1A",
        expenseSurface: "#211319",
    },

    light: {
        background: "#F5F7FB",
        surface: "#FFFFFF",
        border: "#E1E6EF",
        text: "#19202E",
        muted: "#68758A",
        income: "#034f46",
        expense: "#a40021",
        disabled: "#E2E7F0",
        inputBackground: "#FFFFFF",
        incomeSurface: "#b3f9ec",
        expenseSurface: "#fcd8e0",
    },
};

/**
 * Hook customizado que retorna a paleta de cores ativas com base nas preferências
 * de aparência do sistema operacional do user
 * @returns {Theme} O objeto contendo as cores do tema atual.
 */
export function useAppTheme(): Theme{
    const colorScheme = useColorScheme();

    return colorScheme === "light" ? themes.light: themes.dark;
}