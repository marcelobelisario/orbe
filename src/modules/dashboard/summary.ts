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
    const years = [
        Number(currentMonth.slice(0, 4)),
        ...entries.map((item) => Number(item.date.slice(0, 4))),
    ];
    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);
    return Array.from({length: (lastYear - firstYear + 1) * 12}, (_, index) => {
        const key = `${firstYear + Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
        return {value: key, label: formatMonth(key)};
    }).reverse();
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

export function getDashboardSummary(entries: Transaction[], month: string) {
    const current = getMonthlyTotals(entries, month);
    const previousMonth = shiftMonth(month, -1);
    const previous = getMonthlyTotals(entries, previousMonth);
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
        history,
        previousMonth,
        incomeChange:
            previous.income > 0
                ? ((current.income - previous.income) / previous.income) * 100
                : null,
        expenseChange:
            previous.expenses > 0
                ? ((current.expenses - previous.expenses) / previous.expenses) * 100
                : null,
    };
}
