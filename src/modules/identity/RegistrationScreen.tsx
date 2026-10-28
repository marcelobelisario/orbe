import {router} from "expo-router";
import {Pressable, StyleSheet, Text, View} from "react-native";
import FormScreen from "@/components/formScreen";
import ScreenHeader from "@/components/screenHeader";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";
import {RegisterForm} from "./RegisterForm";

export default function RegistrationScreen() {
    const {colors} = useTheme();
    return (
        <FormScreen>
            <ScreenHeader title="Cadastro" onBack={() => router.replace("/")}/>
            <View style={styles.form}>
                <RegisterForm
                    onSuccess={() => router.replace({pathname: "/", params: {registered: "1"}})}
                />
            </View>
            <View style={styles.footer}>
                <Text style={[styles.text, {color: colors.muted}]}>Já tem uma conta?</Text>
                <Pressable accessibilityRole="link" onPress={() => router.replace("/")} style={styles.link}>
                    <Text style={[styles.text, {fontFamily: fonts.semibold, color: colors.primary}]}>
                        Entrar
                    </Text>
                </Pressable>
            </View>
        </FormScreen>
    );
}
const styles = StyleSheet.create({
    form: {marginTop: 24},
    footer: {
        flex: 1,
        flexDirection: "row",
        gap: 6,
        alignItems: "flex-end",
        justifyContent: "center",
        paddingTop: 40,
    },
    text: {fontFamily: fonts.regular, fontSize: 13, lineHeight: 44},
    link: {minHeight: 44},
});
