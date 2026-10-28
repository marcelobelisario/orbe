import {useLocalSearchParams, router} from "expo-router";
import {useState} from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import {
    Btn,
    FormInput,
    SelectCategories,
    incomeCategories,
    expenseCategories,
    paymentMethods,
} from "@/components";
import FormScreen from "./formScreen";
import ScreenHeader from "./screenHeader";
import {useTransactions} from "@/contexts/transactions";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";
import {
    dateToISO,
    formatAmount,
    formatDateInput,
    parseAmount,
    validateEntry,
} from "@/modules/newEntry/validation";

export default function EntryForm({type}: { type: "income" | "expense" }) {
    const {colors} = useTheme();
    const {addTransaction} = useTransactions();
    const params = useLocalSearchParams<{ category?: string }>();
    const isIncome = type === "income";
    const options = isIncome ? incomeCategories : expenseCategories;
    const initialCategory =
        options.find((item) => item.value === params.category || item.label === params.category)
            ?.value ?? "";
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(initialCategory);
    const [date, setDate] = useState(() => new Date().toLocaleDateString("pt-BR"));
    const [paymentMethod, setPaymentMethod] = useState("");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const errors = validateEntry({amount, description, category, date, paymentMethod}, isIncome);
    const accent = isIncome ? colors.income : colors.expense;
    const surface = isIncome ? colors.incomeSurface : colors.expenseSurface;

    function handleSave() {
        setSubmitted(true);
        if (saving || Object.keys(errors).length) return;
        const selected = options.find((item) => item.value === category);
        const isoDate = dateToISO(date);
        if (!selected || !isoDate) return;
        setSaving(true);
        addTransaction({
            type,
            description: description.trim(),
            category: selected.label,
            emoji: selected.emoji,
            date: isoDate,
            amount: parseAmount(amount),
            notes: notes.trim() || undefined,
            paymentMethod: isIncome
                ? undefined
                : paymentMethods.find((item) => item.value === paymentMethod)?.label,
        });
        router.dismissTo("/dashboard");
    }

    return (
        <FormScreen contentStyle={styles.content}>
            <ScreenHeader subtitle={isIncome ? "Renda" : "Gasto"} title="Novo lançamento"/>
            <View style={[styles.amountPanel, {backgroundColor: surface, borderColor: accent + "30"}]}>
                <Text style={[styles.amountLabel, {color: accent}]}>
                    {isIncome ? "VALOR DA RENDA" : "VALOR DO GASTO"}
                </Text>
                <View style={styles.amountRow}>
                    <Text style={[styles.currency, {color: accent}]}>R$</Text>
                    <TextInput
                        accessibilityLabel="Valor do lançamento em reais"
                        value={formatAmount(amount)}
                        onChangeText={(value) => setAmount(value.replace(/\D/g, "").slice(0, 11))}
                        keyboardType="number-pad"
                        selectTextOnFocus
                        maxLength={16}
                        underlineColorAndroid="transparent"
                        style={[
                            styles.amountInput,
                            {
                                color: parseAmount(amount) ? colors.text : colors.placeholder,
                                width: Math.min(260, Math.max(104, formatAmount(amount).length * 27)),
                            },
                        ]}
                    />
                </View>
            </View>
            {submitted && errors.amount ? (
                <Text style={[styles.error, {color: colors.expense}]}>{errors.amount}</Text>
            ) : null}
            <FormInput
                label="Descrição"
                value={description}
                onChangeText={setDescription}
                placeholder={isIncome ? "Ex: Salário maio, Freelance…" : "Ex: Supermercado, Uber, Netflix…"}
                maxLength={100}
                error={submitted ? errors.description : undefined}
            />
            <SelectCategories
                label="Categoria"
                options={options}
                value={category}
                onChange={setCategory}
                tone={type}
                error={submitted ? errors.category : undefined}
            />
            <FormInput
                label="Data"
                value={date}
                onChangeText={(value) => setDate(formatDateInput(value))}
                placeholder="DD/MM/AAAA"
                keyboardType="number-pad"
                maxLength={10}
                error={submitted ? errors.date : undefined}
            />
            {!isIncome && (
                <SelectCategories
                    label="Forma de pagamento"
                    options={paymentMethods}
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    tone="expense"
                    error={submitted ? errors.paymentMethod : undefined}
                />
            )}
            <FormInput
                label="Observação (opcional)"
                value={notes}
                onChangeText={setNotes}
                placeholder="Alguma anotação sobre este lançamento…"
                multiline
                maxLength={500}
            />
            <Btn
                label="Salvar lançamento"
                size="large"
                variant={type}
                onPress={handleSave}
                disabled={saving}
                loading={saving}
                style={[styles.save, Object.keys(errors).length > 0 && {backgroundColor: colors.elevated}]}
                textStyle={Object.keys(errors).length > 0 ? {color: colors.disabledText} : undefined}
            />
        </FormScreen>
    );
}
const styles = StyleSheet.create({
    content: {gap: 16, paddingBottom: 40},
    amountPanel: {
        borderRadius: radii.card,
        borderWidth: 1,
        padding: 24,
        minHeight: 123,
        justifyContent: "center",
        gap: 8,
        marginTop: 8,
        marginBottom: 8,
    },
    amountLabel: {
        fontFamily: fonts.medium,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.6,
        textAlign: "center",
    },
    amountRow: {flexDirection: "row", justifyContent: "center", alignItems: "baseline", gap: 4},
    currency: {fontFamily: fonts.heading, fontSize: 24, lineHeight: 32},
    amountInput: {
        fontFamily: fonts.heading,
        fontSize: 48,
        lineHeight: 56,
        padding: 0,
        minWidth: 100,
        maxWidth: "80%",
        flexShrink: 1,
        textAlign: "left",
        letterSpacing: -1.2,
    },
    save: {marginTop: 16},
    error: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 18},
});
