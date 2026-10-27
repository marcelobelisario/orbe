import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

interface OrbeLogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export const OrbeLogo: React.FC<OrbeLogoProps> = ({
  size = "md",
  showSubtitle = true,
}) => {
  const iconSize = size === "sm" ? 36 : size === "md" ? 52 : 72;
  const textSize = size === "sm" ? 20 : size === "md" ? 28 : 36;
  const subtitleSize = size === "sm" ? 10 : size === "md" ? 12 : 14;

  return (
    <View style={styles.container}>
      {/* Esfera Orbe com anéis e gradiente */}
      <View
        style={[
          styles.iconContainer,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize / 2,
          },
        ]}
      >
        {/* Glow de fundo */}
        <View
          style={[
            styles.glowEffect,
            {
              width: iconSize + 16,
              height: iconSize + 16,
              borderRadius: (iconSize + 16) / 2,
            },
          ]}
        />

        {/* Gradiente principal da esfera */}
        <LinearGradient
          colors={colors.primaryGradient}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={[
            styles.sphere,
            {
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize / 2,
            },
          ]}
        >
          {/* Reflexo de luz na curvatura */}
          <View
            style={[
              styles.highlight,
              {
                width: iconSize * 0.45,
                height: iconSize * 0.45,
                borderRadius: (iconSize * 0.45) / 2,
              },
            ]}
          />

          {/* Anel orbital interno */}
          <View
            style={[
              styles.orbitalRing,
              {
                width: iconSize * 0.72,
                height: iconSize * 0.28,
                borderRadius: iconSize * 0.36,
              },
            ]}
          />
        </LinearGradient>
      </View>

      {/* Tipografia da Marca */}
      <View style={styles.textWrapper}>
        <View style={styles.brandRow}>
          <Text style={[styles.brandName, { fontSize: textSize }]}>ORBE</Text>
          <View style={styles.dot} />
        </View>
        {showSubtitle && (
          <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>
            GESTÃO FINANCEIRA INTELIGENTE
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  glowEffect: {
    position: "absolute",
    backgroundColor: colors.glow,
    opacity: 0.75,
  },
  sphere: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  highlight: {
    position: "absolute",
    top: 5,
    left: 7,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    transform: [{ rotate: "-25deg" }],
  },
  orbitalRing: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.85)",
    transform: [{ rotate: "-35deg" }],
  },
  textWrapper: {
    alignItems: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  brandName: {
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginBottom: 2,
  },
  subtitle: {
    color: colors.textSecondary,
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: 4,
  },
});
