import {useState} from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {Btn, FormInput, Icon} from "@/components";
import FormScreen from "@/components/formScreen";
import {OrbeLogo} from "@/components/OrbeLogo";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";
import {LoginForm} from "./LoginForm";
import {isValidEmail} from "./validation";

export default function IdentityScreen() {
    const {colors, theme, setTheme} = useTheme();
    const {registered} = useLocalSearchParams<{ registered?: string }>();
    const [forgotModalVisible, setForgotModalVisible] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [recoveryError, setRecoveryError] = useState("");
    const [recoveryNotice, setRecoveryNotice] = useState("");

    function openDashboard() {
        router.replace("/dashboard");
    }

    function openRecovery() {
        setRecoveryEmail("");
        setRecoveryError("");
        setRecoveryNotice("");
        setForgotModalVisible(true);
    }

    function handleRecovery() {
        if (!isValidEmail(recoveryEmail)) {
            setRecoveryError("Informe um e-mail válido");
            return;
        }
        setRecoveryError("");
        setRecoveryNotice("Esta é uma demonstração. Nenhum e-mail foi enviado.");
    }

    return (
        <>
            <FormScreen contentStyle={styles.content}>
                <View style={styles.brand}>
                    <OrbeLogo/>
                    <Btn
                        size="icon"
                        variant="secondary"
                        icon={<Icon emoji={theme === "dark" ? "☀️" : "🌙"} size={16}/>}
                        accessibilityLabel="Alternar tema"
                        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
                        style={styles.theme}
                    />
                </View>
                {registered === "1" ? (
                    <Text accessibilityLiveRegion="polite" style={[styles.notice, {color: colors.income}]}>
                        Cadastro validado na demonstração. Entre para continuar.
                    </Text>
                ) : null}
                <LoginForm
                    onSuccess={openDashboard}
                    onForgotPassword={openRecovery}
                    onExploreDemo={openDashboard}
                />
                <View style={styles.footer}>
                    <Text style={[styles.footerText, {color: colors.muted}]}>Ainda não tem uma conta?</Text>
                    <Pressable
                        accessibilityRole="link"
                        onPress={() => router.push("/register")}
                        style={styles.footerLink}
                    >
                        <Text style={[styles.footerText, {fontFamily: fonts.semibold, color: colors.primary}]}>
                            Cadastre-se
                        </Text>
                    </Pressable>
                </View>
            </FormScreen>
            <Modal
                visible={forgotModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setForgotModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.overlay}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView
                        contentContainerStyle={styles.modalScroll}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View
                            style={[styles.modal, {backgroundColor: colors.surface, borderColor: colors.border}]}
                            accessibilityViewIsModal
                        >
                            <Text accessibilityRole="header" style={[styles.modalTitle, {color: colors.text}]}>
                                Recuperar senha
                            </Text>
                            <FormInput
                                label="E-mail cadastrado"
                                placeholder="seu@email.com"
                                value={recoveryEmail}
                                onChangeText={(value) => {
                                    setRecoveryEmail(value);
                                    setRecoveryError("");
                                    setRecoveryNotice("");
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                error={recoveryError}
                                returnKeyType="send"
                                onSubmitEditing={handleRecovery}
                            />
                            {recoveryNotice ? (
                                <Text
                                    accessibilityLiveRegion="polite"
                                    style={[styles.notice, {color: colors.primary}]}
                                >
                                    {recoveryNotice}
                                </Text>
                            ) : null}
                            <Btn label="Enviar link de recuperação" onPress={handleRecovery}/>
                            <Btn
                                label="Voltar ao login"
                                variant="secondary"
                                onPress={() => setForgotModalVisible(false)}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}
const styles = StyleSheet.create({
    content: {paddingTop: 9},
    brand: {height: 90, alignItems: "center", justifyContent: "flex-start"},
    theme: {position: "absolute", right: 0, top: 0},
    notice: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, marginVertical: 8},
    footer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        alignItems: "flex-end",
        justifyContent: "center",
        paddingTop: 32,
    },
    footerText: {fontFamily: fonts.regular, fontSize: 13, lineHeight: 44},
    footerLink: {minHeight: 44},
    overlay: {flex: 1, backgroundColor: "rgba(0,0,0,0.4)"},
    modalScroll: {flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 25},
    modal: {
        width: "100%",
        maxWidth: 402,
        borderRadius: radii.card,
        borderWidth: 1,
        padding: 20,
        gap: 16,
    },
    modalTitle: {fontFamily: fonts.heading, fontSize: 22, lineHeight: 30},
});
