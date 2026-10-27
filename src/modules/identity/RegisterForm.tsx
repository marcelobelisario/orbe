import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { PasswordStrengthMeter } from "../../components/PasswordStrengthMeter";
import { colors } from "../../theme/colors";

interface RegisterFormProps {
  onSuccess: (userData: { name: string; email: string }) => void;
  onExploreDemo: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onExploreDemo,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Estados de erro
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validate = () => {
    let isValid = true;
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const nameTrim = fullName.trim();
    if (!nameTrim) {
      setFullNameError("Informe seu nome completo");
      isValid = false;
    } else if (nameTrim.split(" ").filter(Boolean).length < 2) {
      setFullNameError("Digite seu nome e sobrenome");
      isValid = false;
    }

    const emailTrim = email.trim();
    if (!emailTrim) {
      setEmailError("Informe seu e-mail");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setEmailError("E-mail com formato inválido");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Crie uma senha");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Mínimo de 6 caracteres");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirme sua senha");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("As senhas não coincidem");
      isValid = false;
    }

    if (!termsAccepted) {
      Alert.alert(
        "Termos de Uso",
        "Por favor, aceite os termos e privacidade para continuar."
      );
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    // Simula criação da conta com persistência
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: fullName.trim(),
        email: email.trim(),
      });
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Crie sua conta</Text>
      <Text style={styles.formSubtitle}>
        Junte-se à Orbe e tenha controle total de seus rendimentos e gastos.
      </Text>

      {/* Nome Completo */}
      <Input
        label="NOME COMPLETO"
        placeholder="Ex: Ana Maria Silva"
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          if (fullNameError) setFullNameError("");
        }}
        autoCapitalize="words"
        autoCorrect={false}
        iconName="person-outline"
        error={fullNameError}
      />

      {/* E-mail */}
      <Input
        label="E-MAIL"
        placeholder="seu.email@exemplo.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) setEmailError("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        iconName="mail-outline"
        error={emailError}
      />

      {/* Senha */}
      <Input
        label="SENHA"
        placeholder="Mínimo de 6 caracteres"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError("");
        }}
        isPassword
        iconName="lock-closed-outline"
        error={passwordError}
      />

      {/* Indicador de força de senha */}
      <PasswordStrengthMeter password={password} />

      {/* Confirmar Senha */}
      <Input
        label="CONFIRMAR SENHA"
        placeholder="Repita a senha criada"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (confirmPasswordError) setConfirmPasswordError("");
        }}
        isPassword
        iconName="shield-checkmark-outline"
        error={confirmPasswordError}
      />

      {/* Termos de Uso e Privacidade */}
      <TouchableOpacity
        style={styles.termsRow}
        onPress={() => setTermsAccepted(!termsAccepted)}
        activeOpacity={0.8}
      >
        <View
          style={[styles.checkbox, termsAccepted && styles.checkboxActive]}
        >
          {termsAccepted && (
            <Ionicons name="checkmark" size={14} color={colors.textDark} />
          )}
        </View>
        <Text style={styles.termsText}>
          Concordo com os{" "}
          <Text style={styles.termsLink}>Termos de Uso</Text> e a{" "}
          <Text style={styles.termsLink}>Política de Privacidade</Text>.
        </Text>
      </TouchableOpacity>

      {/* Botão de Criação */}
      <Button
        title="Criar Minha Conta"
        onPress={handleRegister}
        isLoading={isLoading}
      />

      {/* Segurança garantida */}
      <View style={styles.securityBadge}>
        <Ionicons name="lock-closed" size={14} color={colors.primary} />
        <Text style={styles.securityText}>
          Seus dados são protegidos com criptografia ponta a ponta
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 18,
    marginTop: -2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    backgroundColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: "600",
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.badgeSuccessBg,
    borderRadius: 10,
  },
  securityText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "500",
  },
});
