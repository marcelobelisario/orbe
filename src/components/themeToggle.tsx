import {Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle} from "react-native";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";

export default function ThemeToggle({style}: { style?: StyleProp<ViewStyle> }) {
    const {colors, theme, setTheme} = useTheme();
    return (
        <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Tema da aplicação"
            style={[
                styles.container,
                {backgroundColor: colors.surface, borderColor: colors.border},
                style,
            ]}
        >
            {(
                [
                    {value: "light", label: "Claro"},
                    {value: "dark", label: "Escuro"},
                ] as const
            ).map((option) => (
                <Pressable
                    key={option.value}
                    accessibilityRole="radio"
                    accessibilityLabel={`Tema ${option.label.toLowerCase()}`}
                    accessibilityState={{checked: theme === option.value}}
                    aria-checked={theme === option.value}
                    onPress={() => setTheme(option.value)}
                    style={[
                        styles.option,
                        {backgroundColor: theme === option.value ? colors.primary : "transparent"},
                    ]}
                >
                    <Text
                        style={[
                            styles.label,
                            {color: theme === option.value ? colors.onPrimary : colors.muted},
                        ]}
                    >
                        {option.label}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 4,
        borderRadius: radii.control,
        borderWidth: 1,
        gap: 4,
    },
    option: {
        flex: 1,
        minHeight: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    label: {fontFamily: fonts.medium, fontSize: 12, lineHeight: 16},
});
