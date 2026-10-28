// Os dígitos representam centavos: "123456" corresponde a R$ 1.234,56.
export function parseAmount(value: string) {
    const digits = value.replace(/\D/g, "");
    return digits ? Number(digits) : 0;
}

export function formatAmount(value: string) {
    return (parseAmount(value) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatDateInput(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return (
        digits.slice(0, 2) +
        (digits.length > 2 ? "/" + digits.slice(2, 4) : "") +
        (digits.length > 4 ? "/" + digits.slice(4) : "")
    );
}

export function dateToISO(value: string) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null;
    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day, 12);
    if (
        year < 1900 ||
        year > 9999 ||
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    )
        return null;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export type EntryFields = {
    amount: string;
    description: string;
    category: string;
    date: string;
    paymentMethod: string;
};

export function validateEntry(fields: EntryFields, isIncome: boolean) {
    const errors: Partial<Record<keyof EntryFields, string>> = {};
    const amount = parseAmount(fields.amount);
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 99999999999)
        errors.amount = "Informe um valor entre R$ 0,01 e R$ 999.999.999,99";
    if (!fields.description.trim()) errors.description = "Informe uma descrição";
    if (!fields.category) errors.category = "Escolha uma categoria";
    if (!dateToISO(fields.date)) errors.date = "Informe uma data válida no formato DD/MM/AAAA";
    if (!isIncome && !fields.paymentMethod) errors.paymentMethod = "Escolha a forma de pagamento";
    return errors;
}
