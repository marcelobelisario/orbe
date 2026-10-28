import { useTheme } from "@/theme/themeProvider";
import type { ThemeColors } from "@/theme/tokens";
import { fonts, radii } from "@/theme/tokens";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type EntryType = "income" | "expense";

type EntryFormProps = {
  type: EntryType;
};

const incomeCategories = [
  { label: "Salário", icon: "💼" },
  { label: "Freelance", icon: "💻" },
  { label: "Investimento", icon: "📈" },
  { label: "Benefício", icon: "🎁" },
  { label: "Outros", icon: "💰" },
];

const expenseCategories = [
  { label: "Alimentação", icon: "🛒" },
  { label: "Transporte", icon: "🚗" },
  { label: "Moradia", icon: "🏠" },
  { label: "Saúde", icon: "💊" },
  { label: "Lazer", icon: "🎬" },
  { label: "Educação", icon: "📚" },
  { label: "Roupas", icon: "👕" },
  { label: "Outros", icon: "📦" },
];

const paymentMethods = [
  { label: "Pix", icon: "⚡" },
  { label: "Débito", icon: "💳" },
  { label: "Crédito", icon: "💳" },
  { label: "Dinheiro", icon: "💵" },
];

function formatCurrency(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "0,00";
  const cents = Number(digits);
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function EntryForm({ type }: EntryFormProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { colors } = useTheme();

  const isIncome = type === "income";
  const accent = isIncome ? colors.income : colors.expense;
  const accentSurface = isIncome ? colors.incomeSurface : colors.expenseSurface;
  const categories = isIncome ? incomeCategories : expenseCategories;
  const initialCategory = categories.some((item) => item.label === params.category)
    ? params.category ?? ""
    : "";

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [date, setDate] = useState(new Date().toLocaleDateString("pt-BR"));
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");

  const amountValue = Number(amount.replace(/\D/g, "")) / 100;

  const formattedAmount = amount ? formatCurrency(amount) : "0,00";
  const amountInputWidth = Math.max(80, formattedAmount.length * 19);

  const canSave =
    amountValue > 0 &&
    description.trim().length > 0 &&
    selectedCategory.length > 0 &&
    date.trim().length > 0 &&
    (isIncome || paymentMethod.length > 0);

  function handleSave() {
    if (!canSave) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha o valor, a descrição, a categoria, a data e os demais campos obrigatórios.",
      );
      return;
    }
    router.replace("/");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Cabeçalho ── */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={[styles.eyebrow, { color: accent, fontFamily: fonts.medium }]}>
              {isIncome ? "Renda" : "Gasto"}
            </Text>
            <Text style={[styles.headerTitle, { color: colors.text, fontFamily: fonts.heading }]}>
              Novo lançamento
            </Text>
          </View>
        </View>

        {/* ── Painel de valor ── */}
        <View
          style={[
            styles.amountPanel,
            {
              backgroundColor: accentSurface,
              borderColor: accent + "40",
            },
          ]}
        >
          <Text style={[styles.amountLabel, { color: accent, fontFamily: fonts.semibold }]}>
            {isIncome ? "VALOR DA RENDA" : "VALOR DO GASTO"}
          </Text>

          <View style={styles.amountRow}>
            <View style={styles.amountValueGroup}>
              <Text
                style={[
                  styles.currencySymbol,
                  { color: accent, fontFamily: fonts.heading },
                ]}
              >
                R$
              </Text>

              <TextInput
                accessibilityLabel="Valor do lançamento em reais"
                value={formattedAmount}
                onChangeText={(value) => setAmount(value.replace(/\D/g, ""))}
                keyboardType="numeric"
                style={[
                  styles.amountInput,
                  {
                    color: colors.text,
                    fontFamily: fonts.heading,
                    width: amountInputWidth,
                  },
                ]}
                selectTextOnFocus
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
        </View>

        {/* ── Descrição ── */}
        <FormLabel colors={colors}>DESCRIÇÃO</FormLabel>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder={isIncome ? "Ex.: Salário, freelance..." : "Ex.: Supermercado, Uber..."}
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.text,
              fontFamily: fonts.regular,
            },
          ]}
          accessibilityLabel="Descrição do Lançamento"
          maxLength={100}
        />

        {/* ── Categoria ── */}
        <FormLabel colors={colors}>CATEGORIA</FormLabel>
        <View style={styles.optionsGrid}>
          {categories.map((category) => {
            const selected = selectedCategory === category.label;
            return (
              <Pressable
                key={category.label}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Categoria ${category.label}`}
                onPress={() => setSelectedCategory(category.label)}
                style={[
                  styles.categoryOption,
                  {
                    backgroundColor: selected ? accentSurface : colors.surface,
                    borderColor: selected ? accent : colors.border,
                  },
                ]}
              >
                <Text style={styles.optionIcon}>{category.icon}</Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.optionLabel,
                    { color: selected ? accent : colors.muted, fontFamily: fonts.regular },
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Data ── */}
        <FormLabel colors={colors}>DATA</FormLabel>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="DD/MM/AAAA"
          placeholderTextColor={colors.placeholder}
          keyboardType="numbers-and-punctuation"
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.text,
              fontFamily: fonts.regular,
            },
          ]}
          accessibilityLabel="Data do lançamento"
          maxLength={10}
        />

        {/* ── Forma de pagamento (apenas gastos) ── */}
        {!isIncome && (
          <>
            <FormLabel colors={colors}>FORMA DE PAGAMENTO</FormLabel>
            <View style={styles.optionsGrid}>
              {paymentMethods.map((method) => {
                const selected = paymentMethod === method.label;
                return (
                  <Pressable
                    key={method.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setPaymentMethod(method.label)}
                    style={[
                      styles.categoryOption,
                      {
                        backgroundColor: selected ? accentSurface : colors.surface,
                        borderColor: selected ? accent : colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.optionIcon}>{method.icon}</Text>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: selected ? accent : colors.muted, fontFamily: fonts.regular },
                      ]}
                    >
                      {method.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* ── Observação ── */}
        <FormLabel colors={colors}>OBSERVAÇÃO (opcional)</FormLabel>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Alguma anotação sobre este lançamento..."
          placeholderTextColor={colors.placeholder}
          multiline
          textAlignVertical="top"
          style={[
            styles.notesInput,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.text,
              fontFamily: fonts.regular,
            },
          ]}
          accessibilityLabel="Observação opcional"
          maxLength={500}
        />

        {/* ── Botão Salvar ── */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Salvar lançamento"
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: canSave ? accent : colors.disabled,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.saveButtonText,
              {
                color: canSave ? "#FFFFFF" : colors.disabledText,
                fontFamily: fonts.semibold,
              },
            ]}
          >
            Salvar lançamento
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormLabel({ children, colors }: { children: string; colors: ThemeColors }) {
  return (
    <Text style={[styles.label, { color: colors.muted, fontFamily: fonts.semibold }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  backIcon: {
    fontSize: 27,
    lineHeight: 29,
    marginTop: -3,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 10,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  amountPanel: {
    height: 104,
    borderWidth: 1,
    borderRadius: radii.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  amountLabel: {
    fontSize: 10,
    letterSpacing: 0.6,
    marginBottom: 5,
  },
  amountRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  currencySymbol: {
    fontSize: 31,
    fontWeight: "800",
    marginRight: 0,
  },

  amountInput: {
    width: 80,
    padding: 0,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "800",
    textAlign: "left",
    borderWidth: 0,
    includeFontPadding: false,
  },
  amountValueGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 2,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderRadius: radii.control,
    paddingHorizontal: 12,
    fontSize: 12,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  categoryOption: {
    width: "23.5%",
    minWidth: 64,
    height: 54,
    borderWidth: 1,
    borderRadius: radii.control,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  optionIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 8,
    textAlign: "center",
  },
  notesInput: {
    minHeight: 66,
    borderWidth: 1,
    borderRadius: radii.control,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    marginBottom: 22,
  },
  saveButton: {
    minHeight: 48,
    borderRadius: radii.control,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});