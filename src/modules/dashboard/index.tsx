import MonthSelect from "@/components/monthSelect";
import {LinearGradient} from "expo-linear-gradient";
import {router, useLocalSearchParams} from "expo-router";
import {useEffect, useState, type PropsWithChildren} from "react";
import {Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions} from "react-native";
import {LineChart, PieChart} from "react-native-gifted-charts";
import {SafeAreaView} from "react-native-safe-area-context";
import {formatMonth, getDashboardSummary, getMonthKey, getMonthOptions} from "./summary";

import {
    Btn,
    Icon,
    LoadingBar,
    ThemeToggle,
    TransactionItem,
    ValueVisibilityButton,
} from "@/components";
import {useValueVisibility} from "@/contexts/valueVisibility";
import {categories, formatMoney} from "@/data/finance";
import {useTransactions} from "@/contexts/transactions";
import {useTheme} from "@/theme/themeProvider";
import {fonts, radii} from "@/theme/tokens";
import LoadingState from "@/states/loadingState";
import EmptyState from "@/states/emptyState";

function Card({children}: PropsWithChildren) {
    const {colors} = useTheme();
    return (
        <View style={[styles.card, {backgroundColor: colors.surface, borderColor: colors.border}]}>
            {children}
        </View>
    );
}

export default function Dashboard() {
    const {state} = useLocalSearchParams<{ state?: string }>();
    const {transactions} = useTransactions();
    useEffect(() => {
        if (state !== "loading") return;
        const timer = setTimeout(() => router.replace("/dashboard"), 2000);
        return () => clearTimeout(timer);
    }, [state]);
    if (state === "loading") return <LoadingState/>;
    if (transactions.length === 0) return <EmptyState/>;
    return <DashboardContent/>;
}

function DashboardContent() {
    const {transactions} = useTransactions();
    const {colors} = useTheme();
    const {width, fontScale} = useWindowDimensions();
    const {valuesVisible} = useValueVisibility();
    const compact = width < 360 || fontScale > 1.3;
    const [showTheme, setShowTheme] = useState(false);
    const [chartWidth, setChartWidth] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(getMonthKey);
    const monthOptions = getMonthOptions(transactions, getMonthKey());

    // Todos os indicadores usam somente os lançamentos do mês selecionado.
    const summary = getDashboardSummary(transactions, selectedMonth);
    const {income, expenses, balance, commitment, incomeChange, expenseChange} = summary;
    const previousMonthLabel = formatMonth(summary.previousMonth).toLowerCase();
    const percentage = valuesVisible
        ? commitment === null
            ? "Sem renda"
            : `${commitment.toFixed(1).replace(".", ",")}%`
        : "••••";
    const distribution = categories
        .map((category) => ({
            ...category,
            value: summary.entries
                .filter((item) => item.type === "expense" && item.category === category.name)
                .reduce((sum, item) => sum + item.amount, 0),
        }))
        .filter((category) => category.value > 0);
    const months = summary.history;
    const hasHistory = months.some((month) => month.income > 0 || month.expenses > 0);
    const recent = [...summary.entries].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
    const visibleTransactions = recent.slice(0, 3);
    const displayMoney = (amount: number) => (valuesVisible ? formatMoney(amount) : "••••");

    return (
        <SafeAreaView style={[styles.screen, {backgroundColor: colors.background}]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.flex}>
                            <Text style={[styles.body, {color: colors.muted}]}>Bom dia, Ana 👋</Text>
                            <MonthSelect
                                value={selectedMonth}
                                onChange={setSelectedMonth}
                                options={monthOptions}
                            />
                        </View>
                        <View style={styles.headerActions}>
                            <Btn
                                size="icon"
                                icon={<Icon name="plus" color={colors.onPrimary}/>}
                                onPress={() => router.push("/new-entry/select")}
                                accessibilityRole="button"
                                accessibilityLabel="Adicionar lançamento"
                            />
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Alterar tema"
                                accessibilityState={{expanded: showTheme}}
                                aria-expanded={showTheme}
                                onPress={() => setShowTheme(!showTheme)}
                                hitSlop={4}
                            >
                                <LinearGradient colors={[colors.primary, "#6366f1"]} style={styles.avatar}>
                                    <Text style={styles.avatarText}>A</Text>
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </View>
                    {showTheme && (
                        <View style={{gap: 12}}>
                            <ThemeToggle/>
                            <Btn
                                label="Demonstração e estados da tela"
                                variant="secondary"
                                onPress={() => router.push("/demo")}
                            />
                            <Btn
                                label="Voltar ao login"
                                variant="secondary"
                                onPress={() => router.replace("/")}
                            />
                        </View>
                    )}
                    {summary.entries.length === 0 && (
                        <Card>
                            <Text style={[styles.body, {color: colors.muted}]}>
                                Nenhum lançamento em {formatMonth(selectedMonth).toLowerCase()}.
                            </Text>
                        </Card>
                    )}

                    <LinearGradient
                        colors={[colors.primary, "#0f766e"]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.balanceCard}
                    >
                        <View pointerEvents="none" style={styles.topCircle}/>
                        <View pointerEvents="none" style={styles.bottomCircle}/>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.balanceLabel}>Saldo disponível</Text>
                        </View>
                        <View style={styles.balanceEye}><ValueVisibilityButton/></View>
                        <Text style={styles.balanceValue}>{displayMoney(balance)}</Text>
                        <View style={[styles.balanceDetails, compact && styles.column]}>
                            <View style={styles.flex}>
                                <Text style={styles.balanceCaption}>Renda</Text>
                                <Text style={styles.balanceTotal}>{displayMoney(income)}</Text>
                            </View>
                            <View style={styles.flex}>
                                <Text style={styles.balanceCaption}>Gastos</Text>
                                <Text style={styles.balanceTotal}>{displayMoney(expenses)}</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    <View style={[styles.summaryRow, compact && styles.column]}>
                        {[
                            {
                                label: "Renda",
                                arrow: "↑",
                                total: income,
                                change: incomeChange,
                                color: colors.income,
                                background: colors.incomeSurface,
                            },
                            {
                                label: "Gastos",
                                arrow: "↓",
                                total: expenses,
                                change: expenseChange,
                                color: colors.expense,
                                background: colors.expenseSurface,
                            },
                        ].map((item) => (
                            <View
                                key={item.label}
                                style={[
                                    styles.summaryCard,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    },
                                ]}
                            >
                                <View style={styles.summaryLabel}>
                                    <View style={[styles.arrow, {backgroundColor: item.background}]}>
                                        <Text style={{color: item.color}}>{item.arrow}</Text>
                                    </View>
                                    <Text style={[styles.caption, {color: colors.muted}]}>{item.label}</Text>
                                </View>
                                <Text style={[styles.summaryValue, {color: item.color}]}>
                                    {displayMoney(item.total)}
                                </Text>
                                <Text style={[styles.caption, {color: colors.muted}]}>
                                    {valuesVisible
                                        ? item.change === null
                                            ? "Sem base de comparação"
                                            : `${item.change >= 0 ? "+" : ""}${item.change.toFixed(1).replace(".", ",")}% vs. ${previousMonthLabel}`
                                        : "••••"}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Card>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, styles.flex, {color: colors.text}]}>
                                Comprometimento da renda
                            </Text>
                            <Text
                                style={[
                                    styles.percentage,
                                    {color: commitment !== null && commitment > 50 ? colors.expense : colors.income},
                                ]}
                            >
                                {percentage}
                            </Text>
                        </View>
                        {valuesVisible && commitment !== null ? (
                            <LoadingBar
                                value={commitment}
                                accessibilityLabel="Comprometimento da renda"
                                style={styles.progress}
                            />
                        ) : (
                            <View style={[styles.hiddenProgress, {backgroundColor: colors.border}]}/>
                        )}
                        <View style={styles.sectionHeader}>
                            {["0%", "Meta: ≤ 50%", "100%"].map((label) => (
                                <Text key={label} style={[styles.caption, {color: colors.muted}]}>
                                    {label}
                                </Text>
                            ))}
                        </View>
                    </Card>

                    <Card>
                        <Text accessibilityRole="header" style={[styles.sectionTitle, {color: colors.text}]}>
                            Distribuição por categoria
                        </Text>
                        {distribution.length === 0 ? (
                            <Text style={[styles.emptyText, {color: colors.muted}]}>Nenhum gasto neste mês.</Text>
                        ) : (
                            <View style={[styles.distribution, compact && styles.column]}>
                                <View
                                    accessible
                                    accessibilityLabel={
                                        valuesVisible
                                            ? "Gráfico de gastos por categoria. Valores detalhados na legenda."
                                            : "Valores ocultos"
                                    }
                                    style={styles.donut}
                                >
                                    {valuesVisible ? (
                                        <PieChart
                                            data={distribution}
                                            donut
                                            radius={72}
                                            innerRadius={50}
                                            innerCircleColor={colors.surface}
                                            strokeWidth={1}
                                            strokeColor={colors.text}
                                        />
                                    ) : (
                                        <Text style={[styles.caption, {color: colors.muted}]}>Valores ocultos</Text>
                                    )}
                                </View>
                                <View style={styles.legend}>
                                    {distribution.map((item) => (
                                        <View key={item.name} style={styles.legendRow}>
                                            <View style={[styles.dot, {backgroundColor: item.color}]}/>
                                            <Text
                                                numberOfLines={1}
                                                style={[styles.caption, styles.flex, {color: colors.muted}]}
                                            >
                                                {item.name}
                                            </Text>
                                            <Text style={[styles.legendValue, {color: colors.text}]}>
                                                {displayMoney(item.value)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </Card>

                    <Card>
                        <Text accessibilityRole="header" style={[styles.sectionTitle, {color: colors.text}]}>
                            Evolução mensal
                        </Text>
                        <View
                            style={styles.chart}
                            onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}
                            accessible
                            accessibilityRole="image"
                            accessibilityLabel={
                                valuesVisible
                                    ? months
                                        .map(
                                            (month) =>
                                                `${formatMonth(month.key)}: renda ${formatMoney(month.income)}, gastos ${formatMoney(month.expenses)}`,
                                        )
                                        .join(". ")
                                    : "Valores ocultos"
                            }
                        >
                            {valuesVisible && hasHistory && chartWidth > 0 && (
                                <LineChart
                                    data={months.map((month) => ({
                                        value: month.income / 100,
                                        label: month.label,
                                    }))}
                                    data2={months.map((month) => ({
                                        value: month.expenses / 100,
                                    }))}
                                    width={Math.max(1, chartWidth - 40)}
                                    height={130}
                                    // Reserva espaço para os rótulos das duas pontas do gráfico.
                                    spacing={Math.max(1, (chartWidth - 80) / (months.length - 1))}
                                    initialSpacing={8}
                                    endSpacing={8}
                                    areaChart
                                    hideDataPoints
                                    color1={colors.income}
                                    color2={colors.expense}
                                    startFillColor={colors.income}
                                    startFillColor2={colors.expense}
                                    endFillColor={colors.surface}
                                    endFillColor2={colors.surface}
                                    startOpacity={0.15}
                                    endOpacity={0}
                                    thickness={2}
                                    noOfSections={4}
                                    maxValue={Math.max(
                                        1,
                                        ...months
                                            .map((month) => Math.max(month.income, month.expenses))
                                            .map((value) => value / 100),
                                    )}
                                    yAxisLabelWidth={32}
                                    formatYLabel={(label) => `${Number(label) / 1000}k`.replace(".", ",")}
                                    yAxisTextStyle={[styles.chartLabel, {color: colors.muted}]}
                                    xAxisLabelTextStyle={[styles.chartLabel, {color: colors.muted}]}
                                    xAxisColor={colors.border}
                                    yAxisColor="transparent"
                                    rulesColor={colors.border}
                                    disableScroll
                                />
                            )}
                            {!valuesVisible && (
                                <Text style={[styles.caption, {color: colors.muted}]}>Valores ocultos</Text>
                            )}
                            {valuesVisible && !hasHistory && (
                                <Text style={[styles.caption, {color: colors.muted}]}>
                                    Nenhum lançamento neste período.
                                </Text>
                            )}
                        </View>
                        <View style={styles.chartLegend}>
                            <View style={styles.summaryLabel}>
                                <View style={[styles.dot, {backgroundColor: colors.income}]}/>
                                <Text style={[styles.caption, {color: colors.muted}]}>Renda</Text>
                            </View>
                            <View style={styles.summaryLabel}>
                                <View style={[styles.dot, {backgroundColor: colors.expense}]}/>
                                <Text style={[styles.caption, {color: colors.muted}]}>Gastos</Text>
                            </View>
                        </View>
                    </Card>

                    <Card>
                        <View style={styles.sectionHeader}>
                            <Text
                                accessibilityRole="header"
                                style={[styles.sectionTitle, styles.flex, {color: colors.text}]}
                            >
                                Últimos lançamentos
                            </Text>
                            <Pressable
                                accessibilityRole="button"
                                accessibilityLabel="Ver todos os lançamentos"
                                onPress={() => router.push("/statement")}
                                hitSlop={8}
                            >
                                <Text style={[styles.link, {color: colors.primary}]}>Ver todos</Text>
                            </Pressable>
                        </View>
                        <View style={styles.transactions}>
                            {visibleTransactions.length === 0 && (
                                <Text style={[styles.body, {color: colors.muted}]}>
                                    Nenhum lançamento neste mês.
                                </Text>
                            )}
                            {visibleTransactions.map((item) => (
                                <TransactionItem key={item.id} transaction={item}/>
                            ))}
                        </View>
                    </Card>

                    <Card>
                        <View style={styles.insight}>
                            <View style={[styles.transactionIcon, {backgroundColor: colors.incomeSurface}]}>
                                <Icon emoji="✨" size={16}/>
                            </View>
                            <View style={styles.flex}>
                                <Text style={[styles.insightTitle, {color: colors.muted}]}>INSIGHT DO MÊS</Text>
                                <Text style={[styles.insightText, {color: colors.text}]}>
                                    {!valuesVisible
                                        ? "Mostre os valores para consultar o resumo do mês."
                                        : summary.entries.length === 0
                                            ? "Registre lançamentos neste mês para acompanhar suas finanças."
                                            : commitment === null
                                                ? "Há gastos registrados, mas nenhuma renda neste mês."
                                                : `Você utilizou ${percentage} da renda. ${
                                                    commitment <= 50
                                                        ? "Seus gastos estão dentro da meta de 50%."
                                                        : "Seus gastos ultrapassaram a meta de 50%."
                                                }`}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {flex: 1},
    scrollContent: {
        alignItems: "center",
        paddingHorizontal: 25,
        paddingTop: 16,
        paddingBottom: 32,
    },
    content: {width: "100%", maxWidth: 440, gap: 20},
    flex: {flex: 1, minWidth: 0},
    column: {flexDirection: "column"},
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minHeight: 62,
    },
    headerActions: {flexDirection: "row", alignItems: "center", gap: 8},
    body: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 20},
    caption: {fontFamily: fonts.regular, fontSize: 12, lineHeight: 16},
    emptyText: {fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, marginTop: 16},
    avatar: {
        width: 36,
        height: 36,
        borderRadius: radii.pill,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {fontFamily: fonts.semibold, fontSize: 14, color: "#ffffff"},
    balanceCard: {padding: 24, borderRadius: radii.card, overflow: "hidden"},
    balanceEye: {position: "absolute", right: 16, top: 16},
    topCircle: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 80,
        top: -48,
        right: -48,
        backgroundColor: "rgba(255,255,255,0.05)",
    },
    bottomCircle: {
        position: "absolute",
        width: 96,
        height: 96,
        borderRadius: 48,
        bottom: -32,
        left: -32,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    balanceLabel: {
        fontFamily: fonts.medium,
        fontSize: 14,
        lineHeight: 20,
        color: "#cbfbf1",
    },
    balanceValue: {
        fontFamily: fonts.heading,
        fontSize: 36,
        lineHeight: 40,
        letterSpacing: -0.9,
        color: "#ffffff",
        marginTop: 4,
    },
    balanceDetails: {
        flexDirection: "row",
        gap: 24,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.2)",
    },
    balanceCaption: {
        fontFamily: fonts.regular,
        fontSize: 12,
        lineHeight: 16,
        color: "#cbfbf1",
    },
    balanceTotal: {
        fontFamily: fonts.heading,
        fontSize: 18,
        lineHeight: 28,
        marginTop: 2,
        color: "#ffffff",
    },
    summaryRow: {flexDirection: "row", gap: 16},
    summaryCard: {
        flex: 1,
        minWidth: 0,
        borderWidth: 1,
        borderRadius: radii.card,
        padding: 16,
    },
    summaryLabel: {flexDirection: "row", alignItems: "center", gap: 8},
    arrow: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    summaryValue: {
        fontFamily: fonts.heading,
        fontSize: 20,
        lineHeight: 28,
        marginTop: 12,
        marginBottom: 4,
    },
    card: {padding: 20, borderRadius: radii.card, borderWidth: 1},
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    sectionTitle: {fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20},
    percentage: {
        fontFamily: fonts.semibold,
        fontSize: 14,
        lineHeight: 20,
        fontVariant: ["tabular-nums"],
    },
    progress: {marginTop: 12, marginBottom: 8},
    hiddenProgress: {
        height: 10,
        borderRadius: radii.pill,
        marginTop: 12,
        marginBottom: 8,
    },
    distribution: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginTop: 16,
    },
    donut: {width: 144, alignItems: "center"},
    legend: {flex: 1, alignSelf: "stretch", justifyContent: "center", gap: 10},
    legendRow: {flexDirection: "row", alignItems: "center", gap: 8},
    dot: {width: 8, height: 8, borderRadius: 4},
    legendValue: {
        fontFamily: fonts.regular,
        fontSize: 12,
        lineHeight: 16,
        fontVariant: ["tabular-nums"],
    },
    chart: {marginTop: 16, minHeight: 160},
    chartLabel: {fontFamily: fonts.regular, fontSize: 10},
    chartLegend: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 24,
        marginTop: 12,
    },
    link: {fontFamily: fonts.medium, fontSize: 12, lineHeight: 20},
    transactions: {gap: 12, marginTop: 16},
    transactionIcon: {
        width: 36,
        height: 36,
        borderRadius: radii.control,
        alignItems: "center",
        justifyContent: "center",
    },
    insight: {flexDirection: "row", alignItems: "flex-start", gap: 12},
    insightTitle: {
        fontFamily: fonts.semibold,
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.6,
    },
    insightText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        lineHeight: 23,
        marginTop: 6,
    },
    sampleNote: {
        fontFamily: fonts.regular,
        fontSize: 12,
        lineHeight: 16,
        textAlign: "center",
    },
});
