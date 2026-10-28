import assert from "node:assert/strict";
import test from "node:test";
import {
    getDashboardSummary,
    getMonthKey,
    getMonthOptions,
    getMonthlyTotals,
    shiftMonth,
} from "../src/modules/dashboard/summary.ts";

const entry = (id, date, type, amount) => ({
    id,
    date,
    type,
    amount,
    description: "Teste",
    category: "Outros",
    emoji: "📦",
});
const entries = [
    entry(1, "2026-12-31", "income", 20000),
    entry(2, "2027-01-01", "income", 10000),
    entry(3, "2027-01-31", "expense", 3000),
    entry(4, "2026-01-15", "income", 99999),
    entry(5, "2027-02-01", "expense", 5000),
];

test("o mês atual usa a data local do aparelho, inclusive na virada de ano", () => {
    assert.equal(getMonthKey(new Date(2027, 0, 1, 12)), "2027-01");
    assert.equal(shiftMonth("2027-01", -1), "2026-12");
});

test("filtra o mês e o ano e inclui os dias inicial e final", () => {
    const result = getMonthlyTotals(entries, "2027-01");
    assert.deepEqual(
        result.entries.map((item) => item.id),
        [2, 3],
    );
    assert.equal(result.income, 10000);
    assert.equal(result.expenses, 3000);
    assert.equal(result.balance, 7000);
    assert.equal(result.commitment, 30);
});

test("comparação e histórico acompanham o mês selecionado", () => {
    const result = getDashboardSummary(entries, "2027-01");
    assert.equal(result.previousMonth, "2026-12");
    assert.equal(result.incomeChange, -50);
    assert.equal(result.expenseChange, null);
    assert.deepEqual(
        result.history.map((item) => item.key),
        ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01"],
    );
    assert.equal(result.history[3].income, 20000);
    assert.equal(result.history[4].expenses, 3000);
});

test("mês vazio e gasto sem renda não produzem NaN nem percentuais enganosos", () => {
    const empty = getDashboardSummary(entries, "2027-03");
    assert.equal(empty.income, 0);
    assert.equal(empty.expenses, 0);
    assert.equal(empty.commitment, null);
    assert.equal(getMonthlyTotals(entries, "2027-02").commitment, null);
});

test("o seletor inclui somente meses com dados e o mês atual, sem duplicações", () => {
    const options = getMonthOptions(entries, "2028-10");
    assert.ok(options.some((item) => item.value === "2028-10" && item.label === "Outubro 2028"));
    assert.ok(options.some((item) => item.value === "2026-01"));
    assert.equal(new Set(options.map((item) => item.value)).size, options.length);
    assert.deepEqual(
        options.map((item) => item.value),
        ["2028-10", "2027-02", "2027-01", "2026-12", "2026-01"],
    );
    assert.deepEqual(getMonthOptions([], "2028-10"), [{value: "2028-10", label: "Outubro 2028"}]);
});

test("meses futuros só aparecem quando possuem lançamentos", () => {
    const options = getMonthOptions(entries, "2027-01");
    assert.equal(options[0].value, "2027-02");
    assert.equal(
        options.some((item) => item.value === "2027-03"),
        false,
    );
    assert.equal(options.filter((item) => item.value === "2027-01").length, 1);
});
