import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  disabled?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  isLoading = false,
  disabled = false,
  iconName,
  iconPosition = "right",
}) => {
  const isInteractive = !disabled && !isLoading;

  const content = (
    <View style={styles.contentRow}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? colors.textDark : colors.primary}
        />
      ) : (
        <>
          {iconName && iconPosition === "left" && (
            <Ionicons
              name={iconName}
              size={18}
              color={variant === "primary" ? colors.textDark : colors.primary}
              style={styles.iconLeft}
            />
          )}

          <Text
            style={[
              styles.text,
              variant === "primary" && styles.textPrimary,
              variant === "secondary" && styles.textSecondary,
              variant === "outline" && styles.textOutline,
              variant === "ghost" && styles.textGhost,
              disabled && styles.textDisabled,
            ]}
          >
            {title}
          </Text>

          {iconName && iconPosition === "right" && (
            <Ionicons
              name={iconName}
              size={18}
              color={
                disabled
                  ? colors.textMuted
                  : variant === "primary"
                  ? colors.textDark
                  : colors.primary
              }
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </View>
  );

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={!isInteractive}
        activeOpacity={0.85}
        style={[styles.buttonWrapper, disabled && styles.disabledWrapper]}
      >
        <LinearGradient
          colors={disabled ? ["#1A2434", "#141C2B"] : colors.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.baseButton, styles.primaryShadow]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isInteractive}
      activeOpacity={0.8}
      style={[
        styles.buttonWrapper,
        styles.baseButton,
        variant === "secondary" && styles.secondaryButton,
        variant === "outline" && styles.outlineButton,
        variant === "ghost" && styles.ghostButton,
        disabled && styles.disabledWrapper,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    marginVertical: 6,
  },
  baseButton: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  primaryShadow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: colors.cardSecondary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  disabledWrapper: {
    opacity: 0.55,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  textPrimary: {
    color: colors.textDark,
  },
  textSecondary: {
    color: colors.text,
  },
  textOutline: {
    color: colors.primary,
  },
  textGhost: {
    color: colors.textSecondary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
