import {Link} from "expo-router";
import {StyleSheet, View} from "react-native";
import {useTheme} from "@/theme/themeProvider";
import {fonts} from "@/theme/tokens";

const privacyUrl = "https://orbe.jvdslabs.com/politica-de-privacidade.html";
const termsUrl = "https://orbe.jvdslabs.com/termos-de-uso.html";
const deleteAccountUrl = `${privacyUrl}#excluir-conta` as const;

export function LegalLinks({showDeletion = false}: {showDeletion?: boolean}) {
    const {colors} = useTheme();
    const linkStyle = [styles.link, {color: colors.legalLink}];

    return (
        <View style={styles.links}>
            <Link href={privacyUrl} style={linkStyle}>Política de Privacidade</Link>
            <Link href={termsUrl} style={linkStyle}>Termos de Uso</Link>
            {showDeletion && (
                <Link href={deleteAccountUrl} style={linkStyle}>Solicitar exclusão da conta</Link>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    links: {flexDirection: "row", flexWrap: "wrap", justifyContent: "center", columnGap: 16},
    link: {fontFamily: fonts.medium, fontSize: 13, paddingVertical: 12, textDecorationLine: "underline"},
});
