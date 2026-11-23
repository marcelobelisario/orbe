import { FastifyInstance } from 'fastify'
import { consultaController } from '../controllers/consultaController'

export async function consultaRoutes(app: FastifyInstance) {
  app.get('/consultas/saldo', consultaController.getSaldo.bind(consultaController))
  app.get('/consultas/totais-mensais', consultaController.getTotaisMensais.bind(consultaController))
  app.get('/consultas/gastos-por-categoria', consultaController.getGastosPorCategoria.bind(consultaController))
  app.get('/consultas/recentes', consultaController.getRecentes.bind(consultaController))
  app.get('/consultas/evolucao-mensal', consultaController.getEvolucaoMensal.bind(consultaController))
}
