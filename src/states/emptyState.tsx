import {router} from "expo-router";
import {StyleSheet, Text, View} from "react-native";
import FormScreen from "@/components/formScreen";
import {Btn, Icon} from "@/components";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";

export default function EmptyState() {
    const {colors} = useTheme();
    return (
        <FormScreen contentStyle={styles.content}>
            <View style={[styles.icon, {backgroundColor: colors.surface, borderColor: colors.border}]}>
                <Icon emoji="💸" size={30}/>
            </View>
            <Text accessibilityRole="header" style={[styles.title, {color: colors.text}]}>
                Nenhum dado ainda
            </Text>
            <Text style={[styles.message, {color: colors.muted}]}>
                Adicione sua renda e registre seus gastos para visualizar seu painel financeiro.
            </Text>
            <Btn
                label="Adicionar primeiro lançamento"
                size="small"
                onPress={() => router.push("/new-entry/select")}
            />
            <Btn
                label="Voltar"
                size="small"
                variant="secondary"
                onPress={() => router.replace("/demo")}
                style={styles.back}
            />
        </FormScreen>
    );
}
const styles = StyleSheet.create({
    content: {alignItems: "center", paddingTop: 91},
    icon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 11,
    },
    title: {
        fontFamily: fonts.heading,
        fontSize: 20,
        lineHeight: 28,
        textAlign: "center",
        marginBottom: 11,
    },
    message: {
        fontFamily: fonts.regular,
        fontSize: 14,
        lineHeight: 22.75,
        textAlign: "center",
        maxWidth: 304,
        marginBottom: 32,
    },
    back: {marginTop: 24},
});
