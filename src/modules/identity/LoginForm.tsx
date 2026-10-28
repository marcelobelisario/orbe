import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Btn, FormInput} from "@/components";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";
import {validateLogin} from "./validation";

type LoginFormProps = {
    onSuccess: () => void;
    onForgotPassword: () => void;
    onExploreDemo: () => void;
};

export function LoginForm({onSuccess, onForgotPassword, onExploreDemo}: LoginFormProps) {
    const {colors} = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    function handleLogin() {
        const nextErrors = validateLogin(email, password);
        setErrors(nextErrors);
        if (!Object.keys(nextErrors).length) onSuccess();
    }

    return (
        <View style={styles.container}>
            <View style={styles.welcome}>
                <Text accessibilityRole="header" style={[styles.title, {color: colors.text}]}>
                    Bem-vindo!
                </Text>
                <Text style={[styles.body, {color: colors.muted}]}>
                    Acompanhe seu saldo e seus lançamentos.
                </Text>
            </View>
            <View style={styles.fields}>
                <FormInput
                    label="E-mail"
                    placeholder="seu@email.com"
                    value={email}
                    onChangeText={(value) => {
                        setEmail(value);
                        setErrors((current) => ({...current, email: undefined}));
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    error={errors.email}
                />
                <FormInput
                    label="Senha"
                    placeholder="••••••••"
                    value={password}
                    onChangeText={(value) => {
                        setPassword(value);
                        setErrors((current) => ({...current, password: undefined}));
                    }}
                    isPassword
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    error={errors.password}
                    returnKeyType="go"
                    onSubmitEditing={handleLogin}
                />
            </View>
            <Pressable
                onPress={onForgotPassword}
                accessibilityRole="button"
                style={styles.recovery}
                hitSlop={12}
            >
                <Text style={[styles.recoveryText, {color: colors.primary}]}>Esqueceu a senha?</Text>
            </Pressable>
            <Btn label="Entrar" onPress={handleLogin}/>
            <Pressable onPress={onExploreDemo} accessibilityRole="button" style={styles.demo}>
                <Text style={[styles.demoText, {color: colors.muted}]}>Explorar demonstração</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {gap: 26},
    welcome: {gap: 8},
    title: {fontFamily: fonts.heading, fontSize: 28, lineHeight: 36},
    body: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 24},
    fields: {gap: 18},
    recovery: {minHeight: 20, alignItems: "flex-end", justifyContent: "center"},
    recoveryText: {fontFamily: fonts.semibold, fontSize: 12, lineHeight: 20},
    demo: {minHeight: 44, justifyContent: "center", alignItems: "center"},
    demoText: {fontFamily: fonts.medium, fontSize: 12, lineHeight: 20},
});
