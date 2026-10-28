import {StyleSheet, Text, View} from "react-native";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";
import {getPasswordStrength, MIN_PASSWORD_LENGTH} from "@/modules/identity/validation";

export function PasswordStrengthMeter({password}: { password: string }) {
    const {colors} = useTheme();
    if (!password) return null;
    const score = getPasswordStrength(password);
    const label = ["Muito curta", "Senha fraca", "Senha média", "Senha forte"][score];
    const color = score < 2 ? colors.expense : score === 2 ? colors.muted : colors.income;
    return (
        <View style={styles.container}>
            <View style={styles.bars} accessibilityLabel={`Força da senha: ${label}`}>
                {[1, 2, 3].map((level) => (
                    <View
                        key={level}
                        style={[styles.bar, {backgroundColor: score >= level ? color : colors.border}]}
                    />
                ))}
            </View>
            <Text style={[styles.label, {color}]}>{label}</Text>
            <Text style={[styles.hint, {color: colors.muted}]}>
                Mínimo de {MIN_PASSWORD_LENGTH} caracteres. Números e símbolos aumentam a força.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {gap: 6},
    bars: {flexDirection: "row", gap: 6},
    bar: {flex: 1, height: 4, borderRadius: 2},
    label: {fontFamily: fonts.semibold, fontSize: 12},
    hint: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 18},
});
