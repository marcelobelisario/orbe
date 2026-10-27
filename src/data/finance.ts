export type Transaction = {
    id: number;
    description: string;
    category: string;
    emoji: string;
    type: "income" | "expense";
    date: string;
    amount: number;
};

export const transactions: Transaction[] = [
    {
        id: 1,
        description: "Salário",
        category: "Renda",
        emoji: "💼",
        type: "income",
        date: "2026-09-01",
        amount: 480000,
    },
    {
        id: 2,
        description: "Supermercado",
        category: "Alimentação",
        emoji: "🛒",
        type: "expense",
        date: "2026-09-03",
        amount: 34250,
    },
    {
        id: 3,
        description: "Uber",
        category: "Transporte",
        emoji: "🚗",
        type: "expense",
        date: "2026-09-04",
        amount: 2890,
    },
    {
        id: 4,
        description: "Netflix",
        category: "Lazer",
        emoji: "🎬",
        type: "expense",
        date: "2026-09-05",
        amount: 5590,
    },
    {
        id: 5,
        description: "Farmácia",
        category: "Saúde",
        emoji: "💊",
        type: "expense",
        date: "2026-09-07",
        amount: 8730,
    },
    {
        id: 6,
        description: "Freelance Design",
        category: "Renda",
        emoji: "💼",
        type: "income",
        date: "2026-09-10",
        amount: 120000,
    },
    {
        id: 7,
        description: "Aluguel",
        category: "Moradia",
        emoji: "🏠",
        type: "expense",
        date: "2026-09-10",
        amount: 140000,
    },
];

export const categories = [
    {name: "Moradia", color: "#14b8a6"},
    {name: "Alimentação", color: "#10b981"},
    {name: "Saúde", color: "#6366f1"},
    {name: "Transporte", color: "#f59e0b"},
    {name: "Lazer", color: "#f43f5e"},
];

const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function formatMoney(cents: number) {
    return currency.format(cents / 100);
}
