import { FastifyInstance } from 'fastify'
import { usuarioController } from '../controllers/usuarioController'

export async function usuarioRoutes(app: FastifyInstance) {
  app.post('/usuarios', usuarioController.create.bind(usuarioController))
  app.post('/usuarios/login', usuarioController.login.bind(usuarioController))
  app.post('/login', usuarioController.login.bind(usuarioController))
  app.get('/usuarios', usuarioController.list.bind(usuarioController))
  app.get('/usuarios/:id', usuarioController.getById.bind(usuarioController))
  app.put('/usuarios/:id', usuarioController.update.bind(usuarioController))
  app.delete('/usuarios/:id', usuarioController.delete.bind(usuarioController))
}
