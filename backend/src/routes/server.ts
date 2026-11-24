import { FastifyInstance } from 'fastify'
import '@fastify/swagger'
import { usuarioController } from '../controllers/usuarioController'
import { authenticate } from '../middlewares/authenticate'
import { usuarioRoutes } from './usuarioRoutes'
import { categoriaRoutes } from './categoriaRoutes'
import { lancamentoRoutes } from './lancamentoRoutes'
import { consultaRoutes } from './consultaRoutes'

export async function registerRoutes(app: FastifyInstance) {
  const publicRoute = { schema: { security: [] } }
  app.post('/usuarios', publicRoute, usuarioController.create.bind(usuarioController))
  app.post('/usuarios/login', publicRoute, usuarioController.login.bind(usuarioController))
  app.post('/login', publicRoute, usuarioController.login.bind(usuarioController))

  await app.register(async (privateRoutes) => {
    privateRoutes.addHook('onRequest', authenticate)
    await privateRoutes.register(usuarioRoutes)
    await privateRoutes.register(categoriaRoutes)
    await privateRoutes.register(lancamentoRoutes)
    await privateRoutes.register(consultaRoutes)
  })
}

export default registerRoutes
