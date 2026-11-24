export type CategoriaTipo = 'renda' | 'gasto';

export interface Categoria {
  id: number;
  usuario_id: number;
  tipo: CategoriaTipo;
  nome: string;
  criado_em: string;
}

export interface CreateCategoriaDTO {
  tipo: CategoriaTipo;
  nome: string;
}

export interface UpdateCategoriaDTO {
  tipo?: CategoriaTipo;
  nome?: string;
}

export interface ListCategoriaQuery {
  tipo?: CategoriaTipo;
  nome?: string;
  limit?: number;
  offset?: number;
}
