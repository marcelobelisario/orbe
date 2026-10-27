import {StyleSheet, Text, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";

type OrbeLogoProps = {size?: "sm" | "md" | "lg"; showSubtitle?: boolean};

export function OrbeLogo({size = "md", showSubtitle = true}: OrbeLogoProps) {
  const {colors} = useTheme();
  const iconSize = {sm: 36, md: 52, lg: 72}[size];
  const textSize = {sm: 20, md: 28, lg: 36}[size];
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.income]}
        start={{x: 0.1, y: 0.1}}
        end={{x: 0.9, y: 0.9}}
        style={[styles.sphere, {width: iconSize, height: iconSize, borderRadius: iconSize / 2}]}
      >
        <View
          style={[
            styles.highlight,
            {width: iconSize * 0.45, height: iconSize * 0.45, borderRadius: iconSize / 2},
          ]}
        />
        <View
          style={[
            styles.orbit,
            {width: iconSize * 0.72, height: iconSize * 0.28, borderRadius: iconSize / 2},
          ]}
        />
      </LinearGradient>
      <Text style={[styles.brand, {fontSize: textSize, color: colors.text}]}>
        ORBE<Text style={{color: colors.primary}}>.</Text>
      </Text>
      {showSubtitle && (
        <Text style={[styles.subtitle, {color: colors.muted}]}>GESTÃO FINANCEIRA INTELIGENTE</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: "center", gap: 8},
  sphere: {alignItems: "center", justifyContent: "center"},
  highlight: {position: "absolute", top: 5, left: 7, backgroundColor: "rgba(255,255,255,0.4)"},
  orbit: {borderWidth: 2, borderColor: "rgba(255,255,255,0.85)", transform: [{rotate: "-35deg"}]},
  brand: {fontFamily: fonts.heading, letterSpacing: 4},
  subtitle: {fontFamily: fonts.medium, fontSize: 10, letterSpacing: 1, textAlign: "center"},
});
