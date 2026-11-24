import type {Transaction} from "@/data/finance";

const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

// Usa a data local do aparelho; as chaves ficam no formato AAAA-MM.
export function getMonthKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonth(key: string) {
    const [year, month] = key.split("-");
    return `${monthNames[Number(month) - 1]} ${year}`;
}

export function shiftMonth(key: string, offset: number) {
    const [year, month] = key.split("-").map(Number);
    return getMonthKey(new Date(year, month - 1 + offset, 1));
}

export function getMonthOptions(entries: Transaction[], currentMonth: string) {
    const months = new Set([currentMonth, ...entries.map((item) => item.date.slice(0, 7))]);
    return [...months]
        .sort()
        .reverse()
        .map((value) => ({value, label: formatMonth(value)}));
}

export function getMonthlyTotals(entries: Transaction[], month: string) {
    const selected = entries.filter((item) => item.date.startsWith(`${month}-`));
    const income = selected
        .filter((item) => item.type === "income")
        .reduce((sum, item) => sum + item.amount, 0);
    const expenses = selected
        .filter((item) => item.type === "expense")
        .reduce((sum, item) => sum + item.amount, 0);
    return {
        entries: selected,
        income,
        expenses,
        balance: income - expenses,
        commitment: income > 0 ? (expenses / income) * 100 : null,
    };
}

export function getDashboardSummary(entries: Transaction[], month: string, today = new Date()) {
    const current = getMonthlyTotals(entries, month);
    const previousMonth = shiftMonth(month, -1);
    const previous = getMonthlyTotals(entries, previousMonth);
    const todayKey = `${getMonthKey(today)}-${String(today.getDate()).padStart(2, "0")}`;
    const availableBalance = entries.reduce((total, entry) => {
        if (entry.date > todayKey) return total;
        return total + (entry.type === "income" ? entry.amount : -entry.amount);
    }, 0);

    const categoryTotals = new Map<string, number>();
    for (const entry of current.entries) {
        if (entry.type === "expense") {
            categoryTotals.set(entry.category, (categoryTotals.get(entry.category) ?? 0) + entry.amount);
        }
    }
    const expensesByCategory = Array.from(categoryTotals, ([name, value]) => ({name, value}));
    const recentTransactions = [...current.entries]
        .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
        .slice(0, 3);

    const history = Array.from({length: 5}, (_, index) => {
        const key = shiftMonth(month, index - 4);
        const totals = getMonthlyTotals(entries, key);
        return {
            key,
            label: formatMonth(key).slice(0, 3),
            income: totals.income,
            expenses: totals.expenses,
        };
    });
    return {
        ...current,
        availableBalance,
        expensesByCategory,
        recentTransactions,
        isAboveCommitmentGoal: current.commitment !== null && current.commitment > 50,
        history,
        previousMonth,
        incomeChange:
            previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : null,
        expenseChange:
            previous.expenses > 0
                ? ((current.expenses - previous.expenses) / previous.expenses) * 100
                : null,
    };
}
