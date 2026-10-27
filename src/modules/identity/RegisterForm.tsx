import {useState} from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {Btn, FormInput, Icon} from "@/components";
import {PasswordStrengthMeter} from "@/components/PasswordStrengthMeter";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";
import {MIN_PASSWORD_LENGTH, validateRegistration, type RegistrationErrors} from "./validation";

type RegisterFormProps = {onSuccess: (user: {name: string; email: string}) => void};

export function RegisterForm({onSuccess}: RegisterFormProps) {
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
    if (Object.keys(nextErrors).length) return;
    // Apenas uma demonstração local; a integração de cadastro será feita depois.
    onSuccess({name: fullName.trim(), email: email.trim()});
  }

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={[styles.title, {color: colors.text}]}>
        Crie sua conta
      </Text>
      <Text style={[styles.body, {color: colors.muted}]}>
        Tenha controle de seus rendimentos e gastos.
      </Text>
      <FormInput
        label="Nome completo"
        placeholder="Ex: Ana Maria Silva"
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
        placeholder="seu.email@exemplo.com"
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
      <PasswordStrengthMeter password={password} />
      <FormInput
        label="Confirmar senha"
        placeholder="Repita a senha criada"
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
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel="Concordo com os Termos de Uso e a Política de Privacidade"
        accessibilityState={{checked: termsAccepted}}
        onPress={() => {
          setTermsAccepted((accepted) => !accepted);
          clearError("termsAccepted");
        }}
        style={styles.terms}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: colors.border,
              backgroundColor: termsAccepted ? colors.primary : colors.surface,
            },
          ]}
        >
          {termsAccepted && <Icon emoji="✓" size={14} color={colors.onPrimary} />}
        </View>
        <Text style={[styles.termsText, {color: colors.muted}]}>
          Concordo com os Termos de Uso e a Política de Privacidade.
        </Text>
      </Pressable>
      {errors.termsAccepted && (
        <Text accessibilityLiveRegion="polite" style={[styles.body, {color: colors.expense}]}>
          {errors.termsAccepted}
        </Text>
      )}
      <Btn label="Criar Minha Conta" onPress={handleRegister} />
      <Text style={[styles.note, {color: colors.muted}]}>
        Demonstração: nenhum dado é salvo ou enviado.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {gap: 16, width: "100%"},
  title: {fontFamily: fonts.heading, fontSize: 22, lineHeight: 30},
  body: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 20},
  terms: {flexDirection: "row", gap: 10, minHeight: 44, alignItems: "center"},
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: radii.control / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  termsText: {flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18},
  note: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, textAlign: "center"},
});
