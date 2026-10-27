import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

interface InputProps extends TextInputProps {
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  iconName,
  error,
  helperText,
  isPassword = false,
  value,
  onChangeText,
  placeholder,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      {/* Label */}
      <View style={styles.labelRow}>
        <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>
        {hasError && <Text style={styles.errorInlineText}>{error}</Text>}
      </View>

      {/* Caixa do Input */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
        ]}
      >
        {/* Ícone à esquerda */}
        {iconName && (
          <View style={styles.iconLeft}>
            <Ionicons
              name={iconName}
              size={19}
              color={
                hasError
                  ? colors.expense
                  : isFocused
                  ? colors.primary
                  : colors.textSecondary
              }
            />
          </View>
        )}

        {/* Campo de Texto */}
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={colors.primary}
          {...rest}
        />

        {/* Botão de Mostrar/Ocultar Senha */}
        {isPassword && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Texto de Ajuda (quando não há erro) */}
      {!hasError && helperText && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  labelError: {
    color: colors.expense,
  },
  errorInlineText: {
    color: colors.expense,
    fontSize: 12,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
    height: 52,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: "#141C2E",
  },
  inputError: {
    borderColor: colors.expense,
    backgroundColor: "#1F151A",
  },
  iconLeft: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    height: "100%",
    paddingVertical: 0,
  },
  iconRight: {
    paddingLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 2,
  },
});
