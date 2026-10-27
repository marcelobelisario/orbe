import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/themeProvider";
import { fonts, radii } from "@/theme/tokens";
import type { ThemeColors } from "@/theme/tokens";

const incomeCategories = [
  "Salário",
  "Freelance",
  "Investimento",
];

const expenseCategories = [
  "Alimentação",
  "Moradia",
  "Lazer",
];

export default function SelectEntryType() {
  const router = useRouter();
  const { colors } = useTheme();

  function openIncome(category?: string) {
    // @ts-ignore – Expo Router typed routes not yet updated for new-entry
    router.push({
      pathname: "/new-entry/income",
      params: category ? { category } : {},
    });
  }

  function openExpense(category?: string) {
    // @ts-ignore – Expo Router typed routes not yet updated for new-entry
    router.push({
      pathname: "/new-entry/expense",
      params: category ? { category } : {},
    });
  }

  return (
    <ScrollView
      style={[
        styles.screen,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={[styles.eyebrow, { color: colors.muted, fontFamily: fonts.medium }]}>
            Novo lançamento
          </Text>
          <Text style={[styles.title, { color: colors.text, fontFamily: fonts.heading }]}>
            O que você vai registrar?
          </Text>
        </View>
      </View>

      <EntryTypeCard
        title="Renda"
        description="Salário, freelance, investimento e outras entradas"
        icon="💼"
        categories={incomeCategories}
        color={colors.income}
        surfaceColor={colors.incomeSurface}
        colors={colors}
        onPress={() => openIncome()}
        onCategoryPress={openIncome}
      />

      <EntryTypeCard
        title="Gasto"
        description="Compras, contas, assinaturas e demais despesas"
        icon="🛒"
        categories={expenseCategories}
        color={colors.expense}
        surfaceColor={colors.expenseSurface}
        colors={colors}
        onPress={() => openExpense()}
        onCategoryPress={openExpense}
      />

      <Text style={[styles.footer, { color: colors.muted, fontFamily: fonts.regular }]}>
        Você poderá editar{" "}
        <Text style={{ color: colors.primary }}>os detalhes após salvar</Text>
      </Text>
    </ScrollView>
  );
}


type EntryTypeCardProps = {
  title: string;
  description: string;
  icon: string;
  categories: string[];
  color: string;
  surfaceColor: string;
  colors: ThemeColors;
  onPress: () => void;
  onCategoryPress: (category: string) => void;
};

function EntryTypeCard({
  title,
  description,
  icon,
  categories,
  color,
  surfaceColor,
  colors,
  onPress,
  onCategoryPress,
}: EntryTypeCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Criar ${title} sem categoria predefinida`}
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardMain,
          { opacity: pressed ? 0.75 : 1 },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: surfaceColor },
          ]}
        >
          <Text style={styles.categoryIcon}>{icon}</Text>
        </View>

        <View style={styles.cardText}>
          <Text style={[styles.cardTitle, { color: colors.text, fontFamily: fonts.semibold }]}>
            {title}
          </Text>

          <Text style={[styles.cardDescription, { color: colors.muted, fontFamily: fonts.regular }]}>
            {description}
          </Text>
        </View>

        <Text style={[styles.arrow, { color: colors.muted }]}>
          ›
        </Text>
      </Pressable>

      <View
        style={[
          styles.divider,
          { backgroundColor: colors.border },
        ]}
      />

      <View style={styles.tags}>
        {categories.map((category) => (
          <Pressable
            key={category}
            accessibilityRole="button"
            accessibilityLabel={`${category}: criar ${title}`}
            onPress={() => onCategoryPress(category)}
            style={({ pressed }) => [
              styles.tag,
              {
                backgroundColor: surfaceColor,
                opacity: pressed ? 0.65 : 1,
              },
            ]}
          >
            <Text style={[styles.tagText, { color, fontFamily: fonts.medium }]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 76,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
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
    fontSize: 11,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
  },
  card: {
    borderWidth: 1,
    borderRadius: radii.card,
    paddingHorizontal: 19,
    paddingTop: 22,
    paddingBottom: 20,
    marginBottom: 12,
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 78,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: radii.control,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  categoryIcon: {
    fontSize: 20,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 16,
  },
  arrow: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginTop: 16,
    marginBottom: 13,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
});