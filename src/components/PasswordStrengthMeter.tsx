import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  if (!password) return null;

  // Critérios
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialOrUpper = /[A-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  let score = 0;
  if (password.length >= 6) score += 1;
  if (hasMinLength && (hasNumber || hasSpecialOrUpper)) score += 1;
  if (hasMinLength && hasNumber && hasSpecialOrUpper) score += 1;

  const getStrengthLabel = () => {
    switch (score) {
      case 1:
        return { text: "Senha fraca", color: colors.expense };
      case 2:
        return { text: "Senha média", color: colors.warning };
      case 3:
        return { text: "Senha forte e segura", color: colors.primary };
      default:
        return { text: "Muito curta", color: colors.expense };
    }
  };

  const strength = getStrengthLabel();

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        <View
          style={[
            styles.bar,
            score >= 1 && { backgroundColor: strength.color },
          ]}
        />
        <View
          style={[
            styles.bar,
            score >= 2 && { backgroundColor: strength.color },
          ]}
        />
        <View
          style={[
            styles.bar,
            score >= 3 && { backgroundColor: strength.color },
          ]}
        />
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.strengthText, { color: strength.color }]}>
          {strength.text}
        </Text>
        <Text style={styles.hintText}>Mín. 8 caracteres, números e símbolos</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -8,
    marginBottom: 14,
  },
  barsRow: {
    flexDirection: "row",
    gap: 6,
    height: 4,
    marginBottom: 6,
  },
  bar: {
    flex: 1,
    height: "100%",
    borderRadius: 2,
    backgroundColor: colors.inputBorder,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  strengthText: {
    fontSize: 11,
    fontWeight: "700",
  },
  hintText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
