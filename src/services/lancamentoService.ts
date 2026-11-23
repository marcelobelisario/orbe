import { api } from './api';
import type { AxiosRequestConfig } from 'axios';
import {
  Lancamento,
  CreateLancamentoDTO,
  UpdateLancamentoDTO,
  ListLancamentoQuery,
  PaginatedResult,
} from '../types';

export const lancamentoService = {
  async create(data: CreateLancamentoDTO, config?: AxiosRequestConfig): Promise<Lancamento> {
    const response = await api.post<Lancamento>('/lancamentos', data, config);
    return response.data;
  },

  async list(query?: ListLancamentoQuery, config?: AxiosRequestConfig): Promise<PaginatedResult<Lancamento>> {
    const response = await api.get<PaginatedResult<Lancamento>>('/lancamentos', {
      ...config,
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

  async delete(id: number): Promise<void> {
    await api.delete(`/lancamentos/${id}`);
  },
};
