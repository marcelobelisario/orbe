import { api } from './api';
import {
  Usuario,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  ListUsuarioQuery,
  PaginatedResult,
  LoginDTO,
  AuthResponse,
} from '../types';

export const usuarioService = {
  async login(data: LoginDTO): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/usuarios/login', data);
    return response.data;
  },

  async create(data: CreateUsuarioDTO): Promise<Usuario> {
    const response = await api.post<Usuario>('/usuarios', data);
    return response.data;
  },

  async list(query?: ListUsuarioQuery): Promise<PaginatedResult<Usuario>> {
    const response = await api.get<PaginatedResult<Usuario>>('/usuarios', {
      params: query,
    });
    return response.data;
  },

  async getById(id: number): Promise<Usuario> {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateUsuarioDTO): Promise<Usuario> {
    const response = await api.put<Usuario>(`/usuarios/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
};
