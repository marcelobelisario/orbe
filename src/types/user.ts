export interface Usuario {
  id: number;
  nome_completo: string;
  email: string;
  criado_em: string;
}

export type User = Usuario;

export interface CreateUsuarioDTO {
  nome_completo: string;
  email: string;
  senha: string;
}

export interface UpdateUsuarioDTO {
  nome_completo?: string;
  email?: string;
  senha?: string;
}

export interface ListUsuarioQuery {
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  total: number;
  limit: number;
  offset: number;
  items: T[];
}

export interface AuthResponse {
  user: Usuario;
  token: string;
}

export interface LoginDTO {
  email: string;
  senha: string;
}
