import { api } from './api';
import {
  Lancamento,
  CreateLancamentoDTO,
  UpdateLancamentoDTO,
  ListLancamentoQuery,
  PaginatedResult,
} from '../types';

export const lancamentoService = {
  async create(data: CreateLancamentoDTO): Promise<Lancamento> {
    const response = await api.post<Lancamento>('/lancamentos', data);
    return response.data;
  },

  async list(query?: ListLancamentoQuery): Promise<PaginatedResult<Lancamento>> {
    const response = await api.get<PaginatedResult<Lancamento>>('/lancamentos', {
      params: query,
    });
    return response.data;
  },

  async getById(id: number): Promise<Lancamento> {
    const response = await api.get<Lancamento>(`/lancamentos/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateLancamentoDTO): Promise<Lancamento> {
    const response = await api.put<Lancamento>(`/lancamentos/${id}`, data);
    return response.data;
  },

  async delete(id: number, usuarioId?: number): Promise<void> {
    await api.delete(`/lancamentos/${id}`, {
      params: usuarioId ? { usuario_id: usuarioId } : undefined,
    });
  },
};
