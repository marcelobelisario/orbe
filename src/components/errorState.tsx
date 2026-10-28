import {StyleSheet, Text, View} from "react-native";
import Btn from "./btn";
import Icon from "./icon";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";

type ErrorStateProps = { title?: string; message?: string; onRetry?: () => void };

export function ErrorState({
                               title = "Erro ao carregar dados",
                               message = "Não foi possível buscar suas informações financeiras. Verifique sua conexão e tente novamente.",
                               onRetry,
                           }: ErrorStateProps) {
    const {colors} = useTheme();
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.icon,
                    {backgroundColor: colors.errorSurface, borderColor: colors.errorBorder},
                ]}
            >
                <Icon emoji="⚠︎" size={30}/>
            </View>
            <Text accessibilityRole="header" style={[styles.title, {color: colors.text}]}>
                {title}
            </Text>
            <Text style={[styles.message, {color: colors.muted}]}>{message}</Text>
            {onRetry ? (
                <Btn label="Tentar novamente" variant="expense" size="small" onPress={onRetry}/>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 104,
        paddingBottom: 80,
        paddingHorizontal: 25,
        minHeight: 469,
    },
    icon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
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
        lineHeight: 22.75,
        textAlign: "center",
        maxWidth: 304,
        marginBottom: 32,
    },
});
