import {createContext, useContext, useState, type PropsWithChildren} from "react";
import {transactions as sampleTransactions, type Transaction} from "@/data/finance";

type TransactionsContextValue = {
    transactions: Transaction[];
    addTransaction: (entry: Omit<Transaction, "id">) => void;
    clearTransactions: () => void;
    restoreExamples: () => void;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export function TransactionsProvider({children}: PropsWithChildren) {
    const [transactions, setTransactions] = useState(sampleTransactions);

    function addTransaction(entry: Omit<Transaction, "id">) {
        setTransactions((current) => [
            ...current,
            {
                ...entry,
                id: Math.max(0, ...current.map((item) => item.id)) + 1,
            },
        ]);
    }

    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                addTransaction,
                clearTransactions: () => setTransactions([]),
                restoreExamples: () => setTransactions(sampleTransactions),
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
}

export function useTransactions() {
    const value = useContext(TransactionsContext);
    if (!value) throw new Error("Use TransactionsProvider ao redor das telas financeiras.");
    return value;
}
