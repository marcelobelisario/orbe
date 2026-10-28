import {router} from "expo-router";
import {StyleSheet, Text, View} from "react-native";
import Btn from "./btn";
import Icon from "./icon";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";

export default function ScreenHeader({
                                         title,
                                         subtitle,
                                         onBack,
                                     }: {
    title: string;
    subtitle?: string;
    onBack?: () => void;
}) {
    const {colors} = useTheme();

    function goBack() {
        if (onBack) onBack();
        else if (router.canGoBack()) router.back();
        else router.replace("/dashboard");
    }

    return (
        <View style={styles.header}>
            <Btn
                size="icon"
                variant="secondary"
                icon={<Icon name="entryBack" color={colors.text}/>}
                accessibilityLabel="Voltar"
                onPress={goBack}
            />
            <View style={styles.text}>
                {subtitle ? <Text style={[styles.subtitle, {color: colors.muted}]}>{subtitle}</Text> : null}
                <Text accessibilityRole="header" style={[styles.title, {color: colors.text}]}>
                    {title}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {flexDirection: "row", gap: 12, alignItems: "center", minHeight: 44},
    text: {flex: 1},
    subtitle: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 16},
    title: {fontFamily: fonts.heading, fontSize: 20, lineHeight: 28},
});
