import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { categoriaService } from '../services/categoriaService'

const createCategoriaSchema = z.object({
  tipo: z.enum(['renda', 'gasto'], { error: 'Tipo deve ser renda ou gasto' }),
  nome: z.string().trim().min(1, 'Nome não pode ser vazio'),
})

const updateCategoriaSchema = z.object({
  tipo: z.enum(['renda', 'gasto']).optional(),
  nome: z.string().trim().min(1).optional(),
})

const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um inteiro positivo'),
})

const listCategoriaQuerySchema = z.object({
  tipo: z.enum(['renda', 'gasto']).optional(),
  nome: z.string().trim().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export class CategoriaController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = createCategoriaSchema.parse(request.body)
    const categoria = await categoriaService.create({ ...data, usuario_id: Number(request.user.sub) })
    return reply.status(201).send(categoria)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = listCategoriaQuerySchema.parse(request.query)
    const result = await categoriaService.list({ ...query, usuario_id: Number(request.user.sub) })
    return reply.status(200).send(result)
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params)
    const item = await categoriaService.getById(id, Number(request.user.sub))
    return reply.status(200).send(item)
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params)
    const data = updateCategoriaSchema.parse(request.body)
    const updated = await categoriaService.update(id, Number(request.user.sub), data)
    return reply.status(200).send(updated)
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params)
    await categoriaService.delete(id, Number(request.user.sub))
    return reply.status(204).send()
  }
}

export const categoriaController = new CategoriaController()
