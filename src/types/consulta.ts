import { LancamentoTipo } from './lancamento';

export interface SaldoResponse {
  saldo_centavos: number;
}

export interface TotaisMensaisResponse {
  renda_centavos: number;
  gasto_centavos: number;
  resultado_centavos: number;
  comprometimento_percentual: number | null;
}

export interface GastosPorCategoriaItem {
  id: number;
  nome: string;
  valor_centavos: number;
  percentual: number | null;
}

export interface LancamentoRecenteItem {
  id: number;
  tipo: LancamentoTipo;
  descricao: string;
  categoria: string;
  data: string;
  valor_centavos: number;
  forma_pagamento: string | null;
  observacao: string | null;
}

export interface EvolucaoMensalItem {
  mes: string;
  renda_centavos: number;
  gasto_centavos: number;
  resultado_centavos: number;
}

export interface SaldoQuery {
  usuario_id: number;
  ate_data: string;
}

export interface MesRangeQuery {
  usuario_id: number;
  inicio_mes: string;
  proximo_mes: string;
}

export interface RecentesQuery {
  usuario_id: number;
  ate_data: string;
  limite?: number;
}

export interface EvolucaoQuery {
  usuario_id: number;
  inicio_mes: string;
}
