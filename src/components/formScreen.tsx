import type {PropsWithChildren} from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useTheme} from "@/theme/themeProvider";

export default function FormScreen({
                                       children,
                                       contentStyle,
                                   }: PropsWithChildren<{ contentStyle?: StyleProp<ViewStyle> }>) {
    const {colors} = useTheme();
    return (
        <SafeAreaView style={[styles.screen, {backgroundColor: colors.background}]}>
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.content, contentStyle]}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {flex: 1},
    content: {
        flexGrow: 1,
        width: "100%",
        maxWidth: 450,
        alignSelf: "center",
        paddingHorizontal: 25,
        paddingVertical: 24,
    },
});
