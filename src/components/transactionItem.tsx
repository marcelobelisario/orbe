import {StyleSheet, Text, View} from "react-native";
import {useValueVisibility} from "@/contexts/valueVisibility";
import {formatMoney, type Transaction} from "@/data/finance";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";
import Icon from "./icon";

export default function TransactionItem({
                                            transaction,
                                            showYear = false,
                                        }: {
    transaction: Transaction;
    showYear?: boolean;
}) {
    const {colors} = useTheme();
    const {valuesVisible} = useValueVisibility();
    const date = transaction.date.split("-").reverse().join("/");

    return (
        <View style={styles.row}>
            <View style={[styles.icon, {backgroundColor: colors.elevated}]}>
                <Icon emoji={transaction.emoji} size={16}/>
            </View>
            <View style={styles.details}>
                <Text style={[styles.name, {color: colors.text}]}>{transaction.description}</Text>
                <Text style={[styles.caption, {color: colors.muted}]}>
                    {transaction.category} · {showYear ? date : date.slice(0, 5)}
                    {showYear && transaction.paymentMethod ? ` · ${transaction.paymentMethod}` : ""}
                </Text>
                {showYear && transaction.notes ? (
                    <Text style={[styles.caption, {color: colors.muted}]}>{transaction.notes}</Text>
                ) : null}
            </View>
            <Text
                style={[
                    styles.value,
                    {
                        color: transaction.type === "income" ? colors.income : colors.expense,
                    },
                ]}
            >
                {valuesVisible
                    ? `${transaction.type === "income" ? "+" : "−"}${formatMoney(transaction.amount)}`
                    : "••••"}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {flexDirection: "row", alignItems: "center", gap: 12},
    icon: {
        width: 36,
        height: 36,
        borderRadius: radii.control,
        alignItems: "center",
        justifyContent: "center",
    },
    details: {flex: 1, minWidth: 0},
    name: {fontFamily: fonts.medium, fontSize: 14, lineHeight: 20},
    caption: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 16},
    value: {
        fontFamily: fonts.semibold,
        fontSize: 12,
        lineHeight: 20,
        fontVariant: ["tabular-nums"],
    },
});
