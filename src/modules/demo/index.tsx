import {router} from "expo-router";
import {StyleSheet, Text, View} from "react-native";
import FormScreen from "@/components/formScreen";
import ScreenHeader from "@/components/screenHeader";
import {Btn, ThemeToggle} from "@/components";
import {useTransactions} from "@/contexts/transactions";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";

export default function DemoScreen() {
    const {colors} = useTheme();
    const {clearTransactions, restoreExamples} = useTransactions();
    return (
        <FormScreen>
            <ScreenHeader title="Demonstração" onBack={() => router.replace("/dashboard")}/>
            <View style={styles.options}>
                <Text style={[styles.body, {color: colors.muted}]}>
                    Cenários para apresentar os estados do painel. O aplicativo usa dados apenas nesta sessão.
                </Text>
                <ThemeToggle/>
                <Btn label="Painel atual" onPress={() => router.replace("/dashboard")}/>
                <Btn
                    label="Restaurar dados de exemplo"
                    variant="secondary"
                    onPress={() => {
                        restoreExamples();
                        router.replace("/dashboard");
                    }}
                />
                <Btn
                    label="Iniciar sem lançamentos"
                    variant="secondary"
                    onPress={() => {
                        clearTransactions();
                        router.replace("/dashboard");
                    }}
                />
                <Btn
                    label="Exibir carregamento"
                    variant="secondary"
                    onPress={() => router.replace({pathname: "/dashboard", params: {state: "loading"}})}
                />
                <Btn
                    label="Exibir abertura do app"
                    variant="secondary"
                    onPress={() => router.replace("/loading")}
                />
                <Btn
                    label="Exibir erro de conexão"
                    variant="secondary"
                    onPress={() => router.replace("/error")}
                />
                <Text style={[styles.note, {color: colors.muted}]}>
                    Restaurar exemplos ou iniciar sem lançamentos substitui os dados da sessão. O carregamento
                    e o erro de conexão são simulados para a apresentação.
                </Text>
            </View>
        </FormScreen>
    );
}
const styles = StyleSheet.create({
    options: {gap: 16, marginTop: 24},
    body: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 22},
    note: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 18},
});
