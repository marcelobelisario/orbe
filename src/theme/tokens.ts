export const darkColors = {
  background: "#0c0e14",
  surface: "#141720",
  elevated: "#1c2030",
  border: "#242840",
  text: "#e8eaf2",
  muted: "#6b7499",
  placeholder: "#3a4066",
  primary: "#14b8a6",
  onPrimary: "#0c0e14",
  income: "#10b981",
  incomeSurface: "rgba(16,185,129,0.1)",
  expense: "#f43f5e",
  expenseSurface: "rgba(244,63,94,0.1)",
  onExpense: "#ffffff",
  disabledText: "#3a4066",
};

export type ThemeColors = { [Key in keyof typeof darkColors]: string };

export const lightColors: ThemeColors = {
  background: "#f5f7fb",
  surface: "#ffffff",
  elevated: "#e9edf5",
  border: "#cbd2e1",
  text: "#182033",
  muted: "#56627c",
  placeholder: "#65718a",
  primary: "#0f766e",
  onPrimary: "#ffffff",
  income: "#047857",
  incomeSurface: "#e5f5ed",
  expense: "#be123c",
  expenseSurface: "#fff0f3",
  onExpense: "#ffffff",
  disabledText: "#68748b",
};

export const fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  heading: "Outfit_700Bold",
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;
export const radii = { control: 12, card: 16, pill: 999 } as const;
