import { api } from './api';
import type { AxiosRequestConfig } from 'axios';
import {
  Categoria,
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
  ListCategoriaQuery,
  PaginatedResult,
} from '../types';

export const categoriaService = {
  async create(data: CreateCategoriaDTO, config?: AxiosRequestConfig): Promise<Categoria> {
    const response = await api.post<Categoria>('/categorias', data, config);
    return response.data;
  },

  async list(query?: ListCategoriaQuery, config?: AxiosRequestConfig): Promise<PaginatedResult<Categoria>> {
    const response = await api.get<PaginatedResult<Categoria>>('/categorias', {
      ...config,
      params: query,
    });
    return response.data;
  },

  async getById(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`/categorias/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateCategoriaDTO): Promise<Categoria> {
    const response = await api.put<Categoria>(`/categorias/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`);
  },
};
