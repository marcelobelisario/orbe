import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import Btn from "@/components/btn";
import Icon from "@/components/icon";
import { useTheme } from "@/theme/themeProvider";
import { fonts } from "@/theme/tokens";

export default function ErrorScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const handleRetry = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/dashboard");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Círculo do Ícone */}
                <View
                    style={[
                        styles.iconWrapper,
                        {
                            backgroundColor: colors.elevated,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Icon emoji="⚠️" size={22} />
                </View>

                {/* Título */}
                <Text style={[styles.title, { color: colors.text }]}>
                    Erro ao carregar dados
                </Text>


                <Text style={[styles.message, { color: colors.muted }]}>
                    Não foi possível buscar suas informações financeiras. Verifique sua conexão e tente novamente.
                </Text>


                <Btn
                    variant="expense"
                    label="Tentar novamente"
                    onPress={handleRetry}
                    style={styles.button}
                />
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
        maxWidth: 320,
        width: "100%",
    },
    iconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
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
        maxWidth: 280,
    },
    button: {
        width: 190,
    },
});