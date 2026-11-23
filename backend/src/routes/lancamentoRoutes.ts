import { FastifyInstance } from 'fastify'
import { lancamentoController } from '../controllers/lancamentoController'

export async function lancamentoRoutes(app: FastifyInstance) {
  app.post('/lancamentos', lancamentoController.create.bind(lancamentoController))
  app.get('/lancamentos', lancamentoController.list.bind(lancamentoController))
  app.get('/lancamentos/:id', lancamentoController.getById.bind(lancamentoController))
  app.put('/lancamentos/:id', lancamentoController.update.bind(lancamentoController))
  app.delete('/lancamentos/:id', lancamentoController.delete.bind(lancamentoController))
}
