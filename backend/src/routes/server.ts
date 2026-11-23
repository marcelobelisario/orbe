import { FastifyInstance } from 'fastify'
import { usuarioRoutes } from './usuarioRoutes'
import { categoriaRoutes } from './categoriaRoutes'
import { lancamentoRoutes } from './lancamentoRoutes'
import { consultaRoutes } from './consultaRoutes'

export async function registerRoutes(app: FastifyInstance) {
  await app.register(usuarioRoutes)
  await app.register(categoriaRoutes)
  await app.register(lancamentoRoutes)
  await app.register(consultaRoutes)
}

export default registerRoutes
