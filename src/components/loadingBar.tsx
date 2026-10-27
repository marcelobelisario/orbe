import {LinearGradient} from "expo-linear-gradient";
import {StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle} from "react-native";

import {useTheme} from "@/theme/themeProvider";
import {radii} from "@/theme/tokens";

export type LoadingBarProps = Omit<ViewProps, "children"> & {
    /** Porcentagem de 0 a 100 */
    value: number;
    height?: number;
    tone?: "income" | "expense" | "primary";
    trackStyle?: StyleProp<ViewStyle>;
};

export default function LoadingBar({
                                       value,
                                       height = 10,
                                       tone = "income",
                                       style,
                                       trackStyle,
                                       accessibilityLabel = "Progresso",
                                       ...props
                                   }: LoadingBarProps) {
    const {colors} = useTheme();
    const percentage = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
    return (
        <View {...props} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} style={style}>
            <View style={[styles.track, {height, backgroundColor: colors.border}, trackStyle]}>
                <LinearGradient
                    colors={[colors[tone], tone === "income" ? colors.primary : colors[tone]]}
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    style={[styles.fill, {width: `${percentage}%`}]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    track: {overflow: "hidden", borderRadius: radii.pill},
    fill: {height: "100%", borderRadius: radii.pill},
});
