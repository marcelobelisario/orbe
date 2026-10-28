import assert from "node:assert/strict";
import test from "node:test";
import {
    dateToISO,
    formatAmount,
    formatDateInput,
    parseAmount,
    validateEntry,
} from "../src/modules/newEntry/validation.ts";

const valid = {
    amount: "12345",
    description: "Mercado",
    category: "food",
    date: "27/10/2026",
    paymentMethod: "pix",
};

test("valores em centavos mantêm a precisão da moeda brasileira", () => {
    assert.equal(parseAmount("1.234,56"), 123456);
    assert.equal(formatAmount("123456"), "1.234,56");
    assert.equal(parseAmount("0,01"), 1);
    assert.equal(parseAmount(""), 0);
    assert.ok(validateEntry({...valid, amount: "0"}, false).amount);
    assert.ok(validateEntry({...valid, amount: "99999999999999999"}, false).amount);
});

test("datas exigem dia real, inclusive em ano bissexto e virada de ano", () => {
    assert.equal(dateToISO("29/02/2028"), "2028-02-29");
    assert.equal(dateToISO("31/12/2026"), "2026-12-31");
    for (const date of ["29/02/2026", "31/04/2026", "00/10/2026", "01/13/2026", "1/1/2026", "abc"])
        assert.equal(dateToISO(date), null);
    assert.equal(formatDateInput("27102026"), "27/10/2026");
    assert.equal(formatDateInput("270"), "27/0");
});

test("gasto exige pagamento, enquanto renda aceita observações e dispensa pagamento", () => {
    assert.deepEqual(validateEntry(valid, false), {});
    assert.deepEqual(validateEntry({...valid, paymentMethod: ""}, true), {});
    assert.ok(validateEntry({...valid, paymentMethod: ""}, false).paymentMethod);
    assert.ok(validateEntry({...valid, description: "  "}, false).description);
    assert.ok(validateEntry({...valid, category: ""}, false).category);
    assert.ok(validateEntry({...valid, date: "31/02/2026"}, false).date);
});
