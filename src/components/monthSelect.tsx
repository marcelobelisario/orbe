import {useEffect, useState} from "react";
import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Animated, {
    cancelAnimation,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";
import Icon from "./icon";

type MonthSelectProps = {
    value: string;
    onChange: (month: string) => void;
    options: { value: string; label: string }[];
};

export default function MonthSelect({value, onChange, options}: MonthSelectProps) {
    const {colors} = useTheme();
    const [open, setOpen] = useState(false);
    const progress = useSharedValue(0);
    const selectedLabel = options.find((month) => month.value === value)?.label ?? "Selecionar mês";

    useEffect(() => {
        progress.set(withTiming(open ? 1 : 0, {duration: 180, reduceMotion: ReduceMotion.System}));
        return () => cancelAnimation(progress);
    }, [open, progress]);

    const arrowStyle = useAnimatedStyle(() => ({
        transform: [{rotate: `${progress.get() * 180}deg`}],
    }));

    return (
        <>
            <Pressable
                onPress={() => setOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={`Selecionar mês, ${selectedLabel}`}
                accessibilityState={{expanded: open}}
                aria-expanded={open}
                testID="dashboard-month-select"
                style={({pressed}) => [styles.trigger, {opacity: pressed ? 0.7 : 1}]}
            >
                <Text style={[styles.title, {color: colors.text}]}>{selectedLabel}</Text>
                <Animated.View style={arrowStyle} testID="month-select-arrow">
                    <Icon name="chevronDown" color={colors.text}/>
                </Animated.View>
            </Pressable>

            <Modal
                visible={open}
                transparent
                animationType="none"
                onRequestClose={() => setOpen(false)}
            >
                <View style={styles.overlay}>
                    <Pressable
                        style={[StyleSheet.absoluteFill, styles.backdrop]}
                        onPress={() => setOpen(false)}
                        accessibilityRole="button"
                        accessibilityLabel="Fechar seleção de mês"
                    />
                    <View
                        style={[
                            styles.menu,
                            {backgroundColor: colors.surface, borderColor: colors.border},
                        ]}
                        accessibilityViewIsModal
                    >
                        <View style={styles.menuHeader}>
                            <Text
                                accessibilityRole="header"
                                style={[styles.menuTitle, {color: colors.text}]}
                            >
                                Selecionar mês
                            </Text>
                            <Pressable
                                onPress={() => setOpen(false)}
                                accessibilityRole="button"
                                style={styles.close}
                            >
                                <Text style={[styles.optionText, {color: colors.primary}]}>
                                    Fechar
                                </Text>
                            </Pressable>
                        </View>
                        <ScrollView style={styles.options}>
                            {options.map((month) => (
                                <Pressable
                                    key={month.value}
                                    accessibilityRole="radio"
                                    accessibilityLabel={month.label}
                                    accessibilityState={{checked: month.value === value}}
                                    aria-checked={month.value === value}
                                    onPress={() => {
                                        onChange(month.value);
                                        setOpen(false);
                                    }}
                                    style={({pressed}) => [
                                        styles.option,
                                        {
                                            backgroundColor:
                                                month.value === value
                                                    ? colors.elevated
                                                    : "transparent",
                                            opacity: pressed ? 0.7 : 1,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            {
                                                color:
                                                    month.value === value
                                                        ? colors.primary
                                                        : colors.text,
                                            },
                                        ]}
                                    >
                                        {month.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minHeight: 44,
        alignSelf: "flex-start",
        maxWidth: "100%",
    },
    title: {fontFamily: fonts.heading, fontSize: 24, lineHeight: 32, flexShrink: 1},
    overlay: {flex: 1, justifyContent: "center", alignItems: "center", padding: 24},
    backdrop: {backgroundColor: "rgba(0,0,0,0.4)"},
    menu: {
        width: "100%",
        maxWidth: 360,
        maxHeight: "75%",
        borderRadius: radii.card,
        borderWidth: 1,
        padding: 16,
    },
    menuHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 8,
    },
    menuTitle: {fontFamily: fonts.heading, fontSize: 20, lineHeight: 28, flex: 1},
    close: {minHeight: 44, justifyContent: "center", paddingHorizontal: 8},
    options: {flexGrow: 0},
    option: {minHeight: 44, padding: 12, borderRadius: radii.control},
    optionText: {fontFamily: fonts.medium, fontSize: 14, lineHeight: 20},
});
