import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { CanceledError, isAxiosError } from "axios";
import { transactions as sampleTransactions, type Transaction } from "@/data/finance";
import { lancamentoService } from "@/services/lancamentoService";
import { categoriaService } from "@/services/categoriaService";
import { getApiSessionSignal } from "@/services/api";
import type { FormaPagamento, Lancamento } from "@/types";
import { useAuth } from "./auth";

type TransactionsContextValue = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (entry: Omit<Transaction, "id">) => Promise<void>;
  clearTransactions: () => void;
  restoreExamples: () => void;
  refreshTransactions: () => void;
};

const paymentLabels: Record<FormaPagamento, string> = {
  pix: "Pix",
  debito: "Débito",
  credito: "Crédito",
  dinheiro: "Dinheiro",
};

function mapLancamentoToTransaction(item: Lancamento): Transaction {
  const emojiMap: Record<string, string> = {
    Renda: "💼",
    Salário: "💼",
    Investimento: "📈",
    Moradia: "🏠",
    Alimentação: "🛒",
    Transporte: "🚗",
    Lazer: "🎬",
    Saúde: "💊",
    Educação: "📚",
  };
  const categoryName = item.categoria_nome || "Geral";

  return {
    id: item.id,
    description: item.descricao,
    category: categoryName,
    emoji: emojiMap[categoryName] || (item.tipo === "renda" ? "💼" : "🛒"),
    type: item.tipo === "renda" ? "income" : "expense",
    date: item.data,
    amount: item.valor_centavos,
    paymentMethod: item.forma_pagamento ? paymentLabels[item.forma_pagamento] : undefined,
    notes: item.observacao || undefined,
  };
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

function createSession(token: string | null, isDemo: boolean) {
  return {
    id: Symbol(),
    token,
    isDemo,
    transactions: isDemo ? sampleTransactions : ([] as Transaction[]),
    isLoading: Boolean(token),
    error: null as string | null,
    loadAttempt: 0,
  };
}

export function TransactionsProvider({ children }: PropsWithChildren) {
  const { user, token: authToken, isDemo, signOut } = useAuth();
  const token = user && !isDemo ? authToken : null;
  const [session, setSession] = useState(() => createSession(token, isDemo));
  if (session.token !== token || session.isDemo !== isDemo) {
    setSession(createSession(token, isDemo));
  }
  const { id: sessionId, transactions, isLoading, error, loadAttempt } = session;

  function setTransactions(update: (current: Transaction[]) => Transaction[]) {
    setSession((current) => current.id === sessionId
      ? { ...current, transactions: update(current.transactions) }
      : current);
  }

  useEffect(() => {
    if (!token) return;

    const sessionSignal = getApiSessionSignal(token);
    if (!sessionSignal) return;

    const controller = new AbortController();
    const { signal } = controller;
    const cancelLoad = () => controller.abort();
    sessionSignal.addEventListener("abort", cancelLoad, { once: true });

    function finishLoad(result: { transactions: Transaction[] } | { error: string }) {
      if (signal.aborted) return;
      setSession((current) => current.id === sessionId
        ? { ...current, ...result, isLoading: false }
        : current);
    }

    async function loadTransactions() {
      try {
        const entries: Transaction[] = [];
        const limit = 100;
        let offset = 0;
        while (!signal.aborted) {
          const page = await lancamentoService.list({ limit, offset }, { signal });
          entries.push(...page.items.map(mapLancamentoToTransaction));
          offset += page.items.length;
          if (offset >= page.total || page.items.length === 0) break;
        }
        finishLoad({ transactions: entries });
      } catch (err) {
        if (signal.aborted) return;
        if (isAxiosError(err) && err.response?.status === 401) {
          signOut();
          return;
        }
        finishLoad({ error: "Não foi possível carregar os lançamentos." });
      }
    }

    void loadTransactions();
    return () => {
      sessionSignal.removeEventListener("abort", cancelLoad);
      cancelLoad();
    };
  }, [token, sessionId, loadAttempt, signOut]);

  async function addTransaction(entry: Omit<Transaction, "id">) {
    if (isDemo) {
      setTransactions((current) => [
        { ...entry, id: Math.max(0, ...current.map((item) => item.id)) + 1 },
        ...current,
      ]);
      return;
    }

    const signal = token ? getApiSessionSignal(token) : undefined;
    if (!signal) throw new Error("Entre na sua conta para salvar um lançamento.");
    const config = { signal };
    const tipo = entry.type === "income" ? "renda" : "gasto";
    const paymentCodes = Object.keys(paymentLabels) as FormaPagamento[];
    const formaPagamento = tipo === "gasto"
      ? paymentCodes.find((code) => paymentLabels[code] === entry.paymentMethod)
      : null;
    const categoryQuery = { tipo, nome: entry.category, limit: 100 } as const;
    const findCategory = async () => {
      const result = await categoriaService.list(categoryQuery, config);
      return result.items.find((category) => category.nome.toLowerCase() === entry.category.toLowerCase());
    };

    let category = await findCategory();
    if (!category) {
      try {
        category = await categoriaService.create({ tipo, nome: entry.category }, config);
      } catch (err) {
        if (!isAxiosError(err) || err.response?.status !== 409) throw err;
        category = await findCategory();
        if (!category) throw err;
      }
    }

    const created = await lancamentoService.create({
      categoria_id: category.id,
      tipo,
      valor_centavos: entry.amount,
      descricao: entry.description,
      data: entry.date,
      forma_pagamento: formaPagamento,
      observacao: entry.notes || null,
    }, config);

    if (signal.aborted) throw new CanceledError();
    setTransactions((current) => [mapLancamentoToTransaction(created), ...current.filter(({ id }) => id !== created.id)]);
  }

  function refreshTransactions() {
    if (!token) return;
    setSession((current) => ({ ...current, isLoading: true, error: null, loadAttempt: current.loadAttempt + 1 }));
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        addTransaction,
        clearTransactions: () => { if (isDemo) setTransactions(() => []); },
        restoreExamples: () => { if (isDemo) setTransactions(() => sampleTransactions); },
        refreshTransactions,
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
