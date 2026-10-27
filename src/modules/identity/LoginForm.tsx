import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { colors } from "../../theme/colors";

interface LoginFormProps {
  onSuccess: (email: string) => void;
  onForgotPassword: () => void;
  onExploreDemo: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPassword,
  onExploreDemo,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Erros
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    const emailTrim = email.trim();
    if (!emailTrim) {
      setEmailError("Informe seu e-mail");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      setEmailError("E-mail com formato inválido");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Informe sua senha");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Senha deve ter ao menos 6 dígitos");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    // Simula validação de credenciais
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(email.trim());
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Bem-vindo de volta</Text>
      <Text style={styles.formSubtitle}>
        Acesse sua conta para visualizar seu saldo e finanças.
      </Text>

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

      <Input
        label="SENHA"
        placeholder="Digite sua senha"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError("");
        }}
        isPassword
        iconName="lock-closed-outline"
        error={passwordError}
      />

      {/* Linha: Lembrar de mim & Esqueci senha */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.rememberMeContainer}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              rememberMe && styles.checkboxActive,
            ]}
          >
            {rememberMe && (
              <Ionicons name="checkmark" size={14} color={colors.textDark} />
            )}
          </View>
          <Text style={styles.rememberMeText}>Lembrar de mim</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onForgotPassword} activeOpacity={0.7}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Principal de Login */}
      <Button
        title="Entrar na Minha Conta"
        onPress={handleLogin}
        isLoading={isLoading}
        iconName="arrow-forward"
      />

      {/* Divisor */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OU</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Acesso Rápido de Demonstração */}
      <Button
        title="Explorar Dashboard (Modo Demonstração)"
        onPress={onExploreDemo}
        variant="secondary"
        iconName="sparkles"
        iconPosition="left"
      />
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
    marginBottom: 24,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: -4,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberMeText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 12,
  },
});
