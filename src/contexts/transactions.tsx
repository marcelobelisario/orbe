import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { transactions as sampleTransactions, type Transaction } from "@/data/finance";
import { lancamentoService } from "@/services/lancamentoService";
import { categoriaService } from "@/services/categoriaService";
import type { Lancamento } from "@/types";
import { useAuth } from "./auth";

type TransactionsContextValue = {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (entry: Omit<Transaction, "id">) => Promise<void>;
  clearTransactions: () => Promise<void>;
  restoreExamples: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
};

const DEFAULT_USER_ID = 1;

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
    paymentMethod: item.forma_pagamento || undefined,
    notes: item.observacao || undefined,
  };
}

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export function TransactionsProvider({ children }: PropsWithChildren) {
  const { user, isDemo } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isDemo) {
        setTransactions(sampleTransactions);
        return;
      }

      const activeUserId = user?.id || DEFAULT_USER_ID;
      const result = await lancamentoService.list({
        usuario_id: activeUserId,
        limit: 100,
      });

      if (result.items && result.items.length > 0) {
        setTransactions(result.items.map(mapLancamentoToTransaction));
      } else {
        setTransactions(sampleTransactions);
      }
    } catch (err: any) {
      console.error("Erro ao carregar lançamentos da API:", err);
      setError("Não foi possível carregar os lançamentos. Usando dados locais.");
      setTransactions(sampleTransactions);
    } finally {
      setIsLoading(false);
    }
  }, [user, isDemo]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchTransactions();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchTransactions]);

  async function addTransaction(entry: Omit<Transaction, "id">) {
    if (isDemo) {
      const newTx: Transaction = {
        ...entry,
        id: Math.max(0, ...transactions.map((item) => item.id)) + 1,
      };
      setTransactions((current) => [newTx, ...current]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const activeUserId = user?.id || DEFAULT_USER_ID;
      const tipo = entry.type === "income" ? "renda" : "gasto";
      let formaPagamento: "pix" | "debito" | "credito" | "dinheiro" | null = null;

      if (tipo === "gasto") {
        const method = (entry.paymentMethod || "").toLowerCase();
        if (method.includes("pix")) formaPagamento = "pix";
        else if (method.includes("cred")) formaPagamento = "credito";
        else if (method.includes("deb")) formaPagamento = "debito";
        else if (method.includes("din")) formaPagamento = "dinheiro";
        else formaPagamento = "pix";
      }

      let categoriaId = 1;
      try {
        const categorias = await categoriaService.list({
          usuario_id: activeUserId,
          tipo,
          nome: entry.category,
        });

        if (categorias.items.length > 0) {
          categoriaId = categorias.items[0].id;
        } else {
          const novaCategoria = await categoriaService.create({
            usuario_id: activeUserId,
            tipo,
            nome: entry.category || (tipo === "renda" ? "Renda" : "Outros"),
          });
          categoriaId = novaCategoria.id;
        }
      } catch {
        categoriaId = 1;
      }

      const created = await lancamentoService.create({
        usuario_id: activeUserId,
        categoria_id: categoriaId,
        tipo,
        valor_centavos: entry.amount,
        descricao: entry.description,
        data: entry.date,
        forma_pagamento: formaPagamento,
        observacao: entry.notes || null,
      });

      const newTx: Transaction = {
        ...entry,
        id: created.id,
      };

      setTransactions((current) => [newTx, ...current]);
    } catch (err: any) {
      console.error("Erro ao adicionar lançamento:", err);
      setError("Erro ao salvar lançamento na API. Adicionado localmente.");
      setTransactions((current) => [
        {
          ...entry,
          id: Math.max(0, ...current.map((item) => item.id)) + 1,
        },
        ...current,
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function clearTransactions() {
    if (isDemo) {
      setTransactions([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const activeUserId = user?.id || DEFAULT_USER_ID;
      for (const tx of transactions) {
        await lancamentoService.delete(tx.id, activeUserId).catch(() => {});
      }
      setTransactions([]);
    } catch (err) {
      console.error("Erro ao limpar lançamentos:", err);
      setError("Erro ao limpar lançamentos.");
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function restoreExamples() {
    try {
      setIsLoading(true);
      setError(null);
      setTransactions(sampleTransactions);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        addTransaction,
        clearTransactions,
        restoreExamples,
        refreshTransactions: fetchTransactions,
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
