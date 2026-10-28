import type {ReactNode} from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    type PressableProps,
    type StyleProp,
    type TextStyle,
} from "react-native";

import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";

export type BtnProps = Omit<PressableProps, "children"> & {
    variant?: "primary" | "secondary" | "income" | "expense";
    loading?: boolean;
    textStyle?: StyleProp<TextStyle>;
} & (
    | { size: "icon"; icon: ReactNode; label?: never }
    | { size?: "small" | "medium" | "large"; label: string; icon?: ReactNode }
    );

export default function Btn({
                                label,
                                icon,
                                variant = "primary",
                                size = "medium",
                                loading = false,
                                disabled = false,
                                style,
                                textStyle,
                                ...props
                            }: BtnProps) {
    const {colors} = useTheme();
    const blocked = disabled || loading;
    const background = disabled
        ? colors.elevated
        : {
            primary: colors.primary,
            secondary: colors.elevated,
            income: colors.income,
            expense: colors.expense,
        }[variant];
    const foreground = disabled
        ? colors.disabledText
        : variant === "secondary"
            ? colors.text
            : variant === "primary"
                ? colors.onPrimary
                : colors.onExpense;

    return (
        <Pressable
            accessibilityRole="button"
            {...props}
            accessibilityState={{...props.accessibilityState, disabled: blocked, busy: loading}}
            aria-disabled={blocked}
            aria-busy={loading}
            disabled={blocked}
            hitSlop={size === "icon" ? 4 : undefined}
            style={(state) => [
                styles.base,
                styles[size],
                {
                    backgroundColor: background,
                    borderColor: variant === "secondary" ? colors.border : "transparent",
                },
                state.pressed && styles.pressed,
                typeof style === "function" ? style(state) : style,
            ]}
        >
            {loading ? <ActivityIndicator color={foreground} size="small"/> : icon}
            {size !== "icon" && label ? (
                <Text
                    style={[
                        styles.label,
                        size === "large" && styles.largeLabel,
                        {color: foreground},
                        textStyle,
                    ]}
                >
                    {label}
                </Text>
            ) : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: radii.control,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    small: {minHeight: 44, paddingHorizontal: 24, paddingVertical: 11},
    medium: {minHeight: 52, paddingHorizontal: 24, paddingVertical: 15},
    large: {minHeight: 56, paddingHorizontal: 24, paddingVertical: 15},
    icon: {width: 36, height: 36},
    label: {
        fontFamily: fonts.semibold,
        fontSize: 14,
        lineHeight: 20,
        textAlign: "center",
        flexShrink: 1,
    },
    largeLabel: {fontFamily: fonts.heading, fontSize: 16, lineHeight: 24},
    pressed: {opacity: 0.75},
});
