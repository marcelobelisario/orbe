import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Btn, FormInput, Icon} from "@/components";
import {PasswordStrengthMeter} from "@/components/PasswordStrengthMeter";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";
import {MIN_PASSWORD_LENGTH, validateRegistration, type RegistrationErrors} from "./validation";

export function RegisterForm({onSuccess}: { onSuccess: () => void }) {
    const {colors} = useTheme();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<RegistrationErrors>({});

    function clearError(field: keyof RegistrationErrors) {
        setErrors((current) => ({...current, [field]: undefined}));
    }

    function handleRegister() {
        const nextErrors = validateRegistration({
            fullName,
            email,
            password,
            confirmPassword,
            termsAccepted,
        });
        setErrors(nextErrors);
        if (!Object.keys(nextErrors).length) onSuccess();
    }

    return (
        <View style={styles.container}>
            <View style={styles.welcome}>
                <Text accessibilityRole="header" style={[styles.title, {color: colors.text}]}>
                    Crie sua conta
                </Text>
                <Text style={[styles.body, {color: colors.muted}]}>
                    Organize suas finanças em um só lugar.
                </Text>
            </View>
            <View style={styles.fields}>
                <FormInput
                    label="Nome completo"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChangeText={(value) => {
                        setFullName(value);
                        clearError("fullName");
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                    error={errors.fullName}
                />
                <FormInput
                    label="E-mail"
                    placeholder="seu@email.com"
                    value={email}
                    onChangeText={(value) => {
                        setEmail(value);
                        clearError("email");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    error={errors.email}
                />
                <FormInput
                    label="Senha"
                    placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
                    value={password}
                    onChangeText={(value) => {
                        setPassword(value);
                        clearError("password");
                        clearError("confirmPassword");
                    }}
                    isPassword
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    error={errors.password}
                />
                <PasswordStrengthMeter password={password}/>
                <FormInput
                    label="Confirmar senha"
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChangeText={(value) => {
                        setConfirmPassword(value);
                        clearError("confirmPassword");
                    }}
                    isPassword
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    error={errors.confirmPassword}
                />
            </View>
            <Pressable
                accessibilityRole="checkbox"
                accessibilityLabel="Li e aceito os Termos de Uso e Política de Privacidade"
                accessibilityState={{checked: termsAccepted}}
                aria-checked={termsAccepted}
                onPress={() => {
                    setTermsAccepted((accepted) => !accepted);
                    clearError("termsAccepted");
                }}
                hitSlop={9}
                style={styles.terms}
            >
                <View
                    style={[
                        styles.checkbox,
                        {
                            borderColor: colors.legalLink,
                            backgroundColor: termsAccepted ? "#0a245a" : "transparent",
                        },
                    ]}
                >
                    {termsAccepted && <Icon name="check" color="#ffffff"/>}
                </View>
                <Text style={[styles.termsText, {color: colors.text}]}>
                    Li e aceito os <Text style={{color: colors.legalLink}}>Termos de Uso</Text> e{" "}
                    <Text style={{color: colors.legalLink}}>Política de Privacidade</Text>.
                </Text>
            </Pressable>
            {errors.termsAccepted ? (
                <Text accessibilityLiveRegion="polite" style={[styles.error, {color: colors.expense}]}>
                    {errors.termsAccepted}
                </Text>
            ) : null}
            <Btn label="Criar conta" onPress={handleRegister}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {gap: 24},
    welcome: {gap: 8},
    title: {fontFamily: fonts.heading, fontSize: 28, lineHeight: 36},
    body: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 24},
    fields: {gap: 12},
    terms: {flexDirection: "row", gap: 7, alignItems: "flex-start", minHeight: 26},
    checkbox: {
        width: 15,
        height: 15,
        borderWidth: 1,
        borderRadius: 2,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
    },
    termsText: {flex: 1, maxWidth: 299, fontFamily: fonts.regular, fontSize: 12, lineHeight: 16},
    error: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 18},
});
