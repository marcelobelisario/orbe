import {Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle} from "react-native";

import {useTheme, type ThemePreference} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";

const options: { value: ThemePreference; label: string }[] = [
    {value: "light", label: "Claro"},
    {value: "dark", label: "Escuro"},
    // {value: "system", label: "Automático"},
];

export default function ThemeToggle({style}: { style?: StyleProp<ViewStyle> }) {
    const {colors, preference, setPreference} = useTheme();
    return (
        <View accessibilityRole="radiogroup" accessibilityLabel="Tema da aplicação"
              style={[styles.container, {backgroundColor: colors.surface, borderColor: colors.border}, style]}>
            {options.map(({value, label}) => (
                <Pressable key={value} accessibilityRole="radio" accessibilityLabel={`Tema ${label.toLowerCase()}`}
                           accessibilityState={{checked: value === preference}} aria-checked={value === preference}
                           onPress={() => setPreference(value)} style={({pressed}) => [styles.option, {
                    backgroundColor: value === preference ? colors.primary : "transparent",
                    opacity: pressed ? 0.75 : 1
                }]}>
                    <Text
                        style={[styles.label, {color: value === preference ? colors.onPrimary : colors.muted}]}>{label}</Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flexDirection: "row", padding: 4, borderRadius: radii.control, borderWidth: 1, gap: 4},
    option: {
        flex: 1,
        minHeight: 44,
        paddingHorizontal: 8,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    },
    label: {fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, textAlign: "center"},
});
