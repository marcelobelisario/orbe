import {router} from "expo-router";
import {ScrollView, StyleSheet} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {ErrorState} from "@/components/errorState";
import {useTheme} from "@/theme/themeProvider";

export default function ErrorScreen() {
    const {colors} = useTheme();
    return (
        <SafeAreaView style={[styles.screen, {backgroundColor: colors.background}]}>
            <ScrollView contentContainerStyle={styles.content}>
                <ErrorState onRetry={() => router.replace("/dashboard")}/>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    screen: {flex: 1},
    content: {width: "100%", maxWidth: 450, alignSelf: "center"},
});
