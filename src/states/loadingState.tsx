import {StyleSheet, View} from "react-native";
import FormScreen from "@/components/formScreen";
import {useTheme} from "@/theme/themeProvider";
import {radii} from "@/theme/tokens";

export default function LoadingState() {
    const {colors} = useTheme();
    const background = {backgroundColor: colors.elevated};
    return (
        <FormScreen>
            <View
                style={styles.content}
                accessibilityLabel="Carregando painel"
                accessibilityState={{busy: true}}
                aria-busy
            >
                <View style={[styles.title, background]}/>
                <View style={[styles.card, {height: 176}, background]}/>
                <View style={styles.row}>
                    <View style={[styles.small, background]}/>
                    <View style={[styles.small, background]}/>
                </View>
                <View style={[styles.card, {height: 144}, background]}/>
                <View style={[styles.card, {height: 208}, background]}/>
                {[0, 1, 2].map((index) => (
                    <View key={index} style={[styles.card, {height: 56}, background]}/>
                ))}
            </View>
        </FormScreen>
    );
}
const styles = StyleSheet.create({
    content: {gap: 20, opacity: 0.64},
    title: {width: 160, height: 32, borderRadius: 8},
    card: {borderRadius: radii.card},
    row: {flexDirection: "row", gap: 16},
    small: {flex: 1, height: 112, borderRadius: radii.card},
});
