import { api } from './api';
import {
  SaldoResponse,
  TotaisMensaisResponse,
  GastosPorCategoriaItem,
  LancamentoRecenteItem,
  EvolucaoMensalItem,
  SaldoQuery,
  MesRangeQuery,
  RecentesQuery,
  EvolucaoQuery,
} from '../types';

export const consultaService = {
  async getSaldo(params: SaldoQuery): Promise<SaldoResponse> {
    const response = await api.get<SaldoResponse>('/consultas/saldo', { params });
    return response.data;
  },

  async getTotaisMensais(params: MesRangeQuery): Promise<TotaisMensaisResponse> {
    const response = await api.get<TotaisMensaisResponse>('/consultas/totais-mensais', {
      params,
    });
    return response.data;
  },

  async getGastosPorCategoria(params: MesRangeQuery): Promise<GastosPorCategoriaItem[]> {
    const response = await api.get<GastosPorCategoriaItem[]>('/consultas/gastos-por-categoria', {
      params,
    });
    return response.data;
  },

  async getRecentes(params: RecentesQuery): Promise<LancamentoRecenteItem[]> {
    const response = await api.get<LancamentoRecenteItem[]>('/consultas/recentes', {
      params,
    });
    return response.data;
  },

  async getEvolucaoMensal(params: EvolucaoQuery): Promise<EvolucaoMensalItem[]> {
    const response = await api.get<EvolucaoMensalItem[]>('/consultas/evolucao-mensal', {
      params,
    });
    return response.data;
  },
};
