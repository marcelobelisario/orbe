import { StyleSheet, Text, View } from "react-native";

import Btn from "@/components/btn";
import Icon from "@/components/icon";
import { useTheme } from "@/theme/themeProvider";
import { fonts } from "@/theme/tokens";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Erro ao carregar dados",
    message = "Não foi possível buscar suas informações financeiras. Verifique sua conexão e tente novamente.",
    onRetry,
}: ErrorStateProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Container circular */}
                <View
                    style={[
                        styles.iconWrapper,
                        {
                            backgroundColor: colors.elevated,
                            borderColor: colors.border,
                        },
                    ]}
                >

                    <Icon emoji="⚠️" size={24} />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>
                    {title}
                </Text>

                <Text style={[styles.message, { color: colors.muted }]}>
                    {message}
                </Text>

                {onRetry && (
                    <Btn
                        variant="expense"
                        label="Tentar novamente"
                        onPress={onRetry}
                        style={styles.button}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    content: {
        alignItems: "center",
        maxWidth: 360,
        width: "100%",
    },
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    title: {
        fontFamily: fonts.heading,
        fontSize: 20,
        lineHeight: 28,
        textAlign: "center",
        marginBottom: 8,
    },
    message: {
        fontFamily: fonts.regular,
        fontSize: 14,
        lineHeight: 20,
        textAlign: "center",
        marginBottom: 24,
    },
    button: {
        width: "100%",
    },
});