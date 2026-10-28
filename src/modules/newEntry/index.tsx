import {router} from "expo-router";
import {Pressable, StyleSheet, Text, View} from "react-native";
import FormScreen from "@/components/formScreen";
import ScreenHeader from "@/components/screenHeader";
import Icon from "@/components/icon";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";

const types = [
    {
        type: "income",
        title: "Renda",
        emoji: "💼",
        description: "Salário, freelance, investimentos e outras entradas",
        tags: [
            {label: "Salário", value: "salary"},
            {label: "Freelance", value: "freelance"},
            {label: "Investimento", value: "investment"},
        ],
    },
    {
        type: "expense",
        title: "Gasto",
        emoji: "🛒",
        description: "Compras, contas, assinaturas e demais despesas",
        tags: [
            {label: "Alimentação", value: "food"},
            {label: "Moradia", value: "housing"},
            {label: "Lazer", value: "leisure"},
        ],
    },
] as const;

export default function SelectEntryType() {
    const {colors} = useTheme();

    function open(type: "income" | "expense", category?: string) {
        router.push({
            pathname: type === "income" ? "/new-entry/income" : "/new-entry/expense",
            params: category ? {category} : {},
        });
    }

    return (
        <FormScreen>
            <ScreenHeader subtitle="Novo lançamento" title="O que você vai registrar?"/>
            <View style={styles.cards}>
                {types.map((item) => {
                    const accent = colors[item.type];
                    const surface = item.type === "income" ? colors.incomeSurface : colors.expenseSurface;
                    return (
                        <View
                            key={item.type}
                            style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}
                        >
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel={`Criar ${item.title.toLowerCase()}`}
                                onPress={() => open(item.type)}
                                style={styles.main}
                            >
                                <View style={[styles.icon, {backgroundColor: surface}]}>
                                    <Icon emoji={item.emoji} size={24}/>
                                </View>
                                <View style={styles.description}>
                                    <Text style={[styles.title, {color: colors.text}]}>{item.title}</Text>
                                    <Text style={[styles.body, {color: colors.muted}]}>{item.description}</Text>
                                </View>
                                <Icon name="entryArrow" color={colors.muted}/>
                            </Pressable>
                            <View style={[styles.tags, {borderTopColor: colors.border}]}>
                                {item.tags.map((tag) => (
                                    <Pressable
                                        key={tag.value}
                                        accessibilityRole="button"
                                        accessibilityLabel={`${tag.label}: criar ${item.title.toLowerCase()}`}
                                        onPress={() => open(item.type, tag.value)}
                                        hitSlop={10}
                                        style={[styles.tag, {backgroundColor: surface}]}
                                    >
                                        <Text style={[styles.tagText, {color: accent}]}>{tag.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>
        </FormScreen>
    );
}
const styles = StyleSheet.create({
    cards: {gap: 16, marginTop: 32},
    card: {padding: 24, borderWidth: 1, borderRadius: radii.card, minHeight: 195},
    main: {flexDirection: "row", gap: 16, alignItems: "center", minHeight: 80},
    icon: {
        width: 56,
        height: 56,
        borderRadius: radii.card,
        alignItems: "center",
        justifyContent: "center",
    },
    description: {flex: 1, minWidth: 0, gap: 2},
    title: {fontFamily: fonts.heading, fontSize: 18, lineHeight: 28},
    body: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 19.25},
    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        borderTopWidth: 1,
        paddingTop: 16,
        marginTop: 16,
    },
    tag: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill},
    tagText: {fontFamily: fonts.medium, fontSize: 12, lineHeight: 16},
});
