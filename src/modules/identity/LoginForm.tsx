import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Btn, FormInput, Icon} from "@/components";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";
import {validateLogin} from "./validation";

type LoginFormProps = {
  onSuccess: (email: string) => void;
  onForgotPassword: () => void;
  onExploreDemo: () => void;
};

export function LoginForm({onSuccess, onForgotPassword, onExploreDemo}: LoginFormProps) {
  const {colors} = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  function handleLogin() {
    const nextErrors = validateLogin(email, password);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSuccess(email.trim());
  }

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={[styles.title, {color: colors.text}]}>
        Bem-vindo de volta
      </Text>
      <Text style={[styles.body, {color: colors.muted}]}>Acesse seu saldo e suas finanças.</Text>
      <FormInput
        label="E-mail"
        placeholder="seu.email@exemplo.com"
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
        placeholder="Digite sua senha"
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
      <Pressable onPress={onForgotPassword} accessibilityRole="button" style={styles.recovery}>
        <Text style={[styles.body, {color: colors.primary}]}>Esqueceu a senha?</Text>
      </Pressable>
      <Btn
        label="Entrar na Minha Conta"
        onPress={handleLogin}
        icon={<Icon name="arrowRight" color={colors.onPrimary} />}
      />
      <View style={styles.divider}>
        <View style={[styles.line, {backgroundColor: colors.border}]} />
        <Text style={[styles.body, {color: colors.muted}]}>OU</Text>
        <View style={[styles.line, {backgroundColor: colors.border}]} />
      </View>
      <Btn label="Explorar Dashboard" variant="secondary" onPress={onExploreDemo} />
      <Text style={[styles.note, {color: colors.muted}]}>
        Modo demonstração: as credenciais não são autenticadas nem salvas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {width: "100%", gap: 16},
  title: {fontFamily: fonts.heading, fontSize: 22, lineHeight: 30},
  body: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 20},
  recovery: {minHeight: 44, alignItems: "flex-end", justifyContent: "center"},
  divider: {flexDirection: "row", gap: 12, alignItems: "center"},
  line: {flex: 1, height: 1},
  note: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, textAlign: "center"},
});
