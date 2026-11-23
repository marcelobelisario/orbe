export type LancamentoTipo = 'renda' | 'gasto';
export type FormaPagamento = 'pix' | 'debito' | 'credito' | 'dinheiro';

export interface Lancamento {
  id: number;
  usuario_id: number;
  categoria_id: number;
  categoria_nome?: string;
  tipo: LancamentoTipo;
  valor_centavos: number;
  descricao: string;
  data: string;
  forma_pagamento: FormaPagamento | null;
  observacao: string | null;
  criado_em: string;
}

export interface CreateLancamentoDTO {
  usuario_id: number;
  categoria_id: number;
  tipo: LancamentoTipo;
  valor_centavos: number;
  descricao: string;
  data: string;
  forma_pagamento?: FormaPagamento | null;
  observacao?: string | null;
}

export interface UpdateLancamentoDTO {
  categoria_id?: number;
  tipo?: LancamentoTipo;
  valor_centavos?: number;
  descricao?: string;
  data?: string;
  forma_pagamento?: FormaPagamento | null;
  observacao?: string | null;
}

export interface ListLancamentoQuery {
  usuario_id?: number;
  categoria_id?: number;
  tipo?: LancamentoTipo;
  data_inicio?: string;
  data_fim?: string;
  forma_pagamento?: FormaPagamento;
  limit?: number;
  offset?: number;
}
