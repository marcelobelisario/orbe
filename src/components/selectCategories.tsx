import {
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";
import Icon from "./icon";

export type CategoryOption = { value: string; label: string; emoji: string; disabled?: boolean };
export const incomeCategories: readonly CategoryOption[] = [
    {value: "salary", label: "Salário", emoji: "💼"},
    {value: "freelance", label: "Freelance", emoji: "💻"},
    {value: "investment", label: "Investimento", emoji: "📈"},
    {value: "benefit", label: "Benefício", emoji: "🎁"},
    {value: "other", label: "Outros", emoji: "💰"},
];
export const expenseCategories: readonly CategoryOption[] = [
    {value: "food", label: "Alimentação", emoji: "🛒"},
    {value: "transport", label: "Transporte", emoji: "🚗"},
    {value: "housing", label: "Moradia", emoji: "🏠"},
    {value: "health", label: "Saúde", emoji: "💊"},
    {value: "leisure", label: "Lazer", emoji: "🎬"},
    {value: "education", label: "Educação", emoji: "📚"},
    {value: "clothing", label: "Roupas", emoji: "👕"},
    {value: "other", label: "Outros", emoji: "📦"},
];
export const paymentMethods: readonly CategoryOption[] = [
    {value: "pix", label: "Pix", emoji: "⚡"},
    {value: "debit", label: "Débito", emoji: "💳"},
    {value: "credit", label: "Crédito", emoji: "🔵"},
    {value: "cash", label: "Dinheiro", emoji: "💵"},
];

export type SelectCategoriesProps = {
    options: readonly CategoryOption[];
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    tone?: "primary" | "income" | "expense";
    disabled?: boolean;
    error?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

export default function SelectCategories({
                                             options,
                                             value,
                                             onChange,
                                             label = "Categoria",
                                             tone = "primary",
                                             disabled = false,
                                             error,
                                             style,
                                             testID,
                                         }: SelectCategoriesProps) {
    const {colors} = useTheme();
    const {fontScale, width} = useWindowDimensions();
    const accent = colors[tone];
    const selectedSurface =
        tone === "income"
            ? colors.incomeSurface
            : tone === "expense"
                ? colors.expenseSurface
                : colors.elevated;
    // Fewer columns at large accessibility text sizes keep every label readable.
    const columns = fontScale > 1.3 || width < 360 ? 2 : 4;
    const rows = Array.from({length: Math.ceil(options.length / columns)}, (_, row) =>
        options.slice(row * columns, (row + 1) * columns),
    );

    return (
        <View style={[styles.container, style]} testID={testID}>
            <Text style={[styles.label, {color: colors.muted}]}>{label}</Text>
            <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.container}>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((option) => {
                            const selected = option.value === value;
                            const blocked = disabled || option.disabled;
                            return (
                                <Pressable
                                    key={option.value}
                                    accessibilityRole="radio"
                                    accessibilityLabel={option.label}
                                    accessibilityState={{checked: selected, disabled: Boolean(blocked)}}
                                    aria-checked={selected}
                                    aria-disabled={Boolean(blocked)}
                                    disabled={blocked}
                                    onPress={() => onChange(option.value)}
                                    style={({pressed}) => [
                                        styles.option,
                                        {
                                            backgroundColor: selected ? selectedSurface : colors.surface,
                                            borderColor: selected ? accent : colors.border,
                                            opacity: blocked ? 0.45 : pressed ? 0.7 : 1,
                                        },
                                    ]}
                                >
                                    <Icon emoji={option.emoji}/>
                                    <Text style={[styles.optionLabel, {color: selected ? accent : colors.muted}]}>
                                        {option.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                        {Array.from({length: columns - row.length}, (_, index) => (
                            <View key={`empty-${index}`} style={styles.spacer}/>
                        ))}
                    </View>
                ))}
            </View>
            {error ? (
                <Text accessibilityLiveRegion="polite" style={[styles.error, {color: colors.expense}]}>
                    {error}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {gap: 8},
    label: {
        fontFamily: fonts.medium,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.6,
        textTransform: "uppercase",
    },
    row: {flexDirection: "row", gap: 8, alignItems: "stretch"},
    option: {
        flex: 1,
        minWidth: 0,
        minHeight: 66.5,
        borderRadius: radii.control,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 2,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    optionLabel: {fontFamily: fonts.medium, fontSize: 10, lineHeight: 12.5, textAlign: "center"},
    spacer: {flex: 1},
    error: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 16},
});
