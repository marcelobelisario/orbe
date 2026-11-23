import { FastifyInstance } from 'fastify'
import { categoriaController } from '../controllers/categoriaController'

export async function categoriaRoutes(app: FastifyInstance) {
  app.post('/categorias', categoriaController.create.bind(categoriaController))
  app.get('/categorias', categoriaController.list.bind(categoriaController))
  app.get('/categorias/:id', categoriaController.getById.bind(categoriaController))
  app.put('/categorias/:id', categoriaController.update.bind(categoriaController))
  app.delete('/categorias/:id', categoriaController.delete.bind(categoriaController))
}
