import {FlatList, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {TransactionItem, ValueVisibilityButton} from "@/components";
import {transactions} from "@/data/finance";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";

export default function Statement() {
    const {colors} = useTheme();
    const entries = [...transactions].sort(
        (a, b) => b.date.localeCompare(a.date) || b.id - a.id,
    );
    return (
        <SafeAreaView
            edges={["left", "right", "bottom"]}
            style={[styles.screen, {backgroundColor: colors.background}]}
        >
            <FlatList
                data={entries}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.flex}>
                            <Text style={[styles.title, {color: colors.text}]}>
                                Todos os lançamentos
                            </Text>
                            <Text style={[styles.caption, {color: colors.muted}]}>
                                {entries.length} lançamentos · Dados de exemplo
                            </Text>
                        </View>
                        <ValueVisibilityButton/>
                    </View>
                }
                renderItem={({item}) => (
                    <View
                        style={[
                            styles.item,
                            {backgroundColor: colors.surface, borderColor: colors.border},
                        ]}
                    >
                        <TransactionItem transaction={item} showYear/>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={[styles.caption, {color: colors.muted}]}>
                        Nenhum lançamento encontrado.
                    </Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {flex: 1},
    content: {
        width: "100%",
        maxWidth: 488,
        alignSelf: "center",
        padding: 24,
        gap: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    flex: {flex: 1},
    title: {fontFamily: fonts.heading, fontSize: 20, lineHeight: 28},
    caption: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 18},
    item: {borderWidth: 1, borderRadius: radii.card, padding: 16},
});
