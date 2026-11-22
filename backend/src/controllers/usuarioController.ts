import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { usuarioService } from '../services/usuarioService'

const createUsuarioSchema = z.object({
  nome_completo: z.string().trim().min(1, 'Nome completo não pode ser vazio'),
  email: z.string().trim().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

const updateUsuarioSchema = z.object({
  nome_completo: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  senha: z.string().min(6).optional(),
})

const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um inteiro positivo'),
})

const listUsuarioQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export class UsuarioController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = createUsuarioSchema.parse(request.body)
    const user = await usuarioService.create(data)
    return reply.status(201).send(user)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = listUsuarioQuerySchema.parse(request.query)
    const result = await usuarioService.list(query)
    return reply.status(200).send(result)
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params)
    const user = await usuarioService.getById(id)
    return reply.status(200).send(user)
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params)
    const data = updateUsuarioSchema.parse(request.body)
    const updated = await usuarioService.update(id, data)
    return reply.status(200).send(updated)
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params)
    await usuarioService.delete(id)
    return reply.status(204).send()
  }
}

export const usuarioController = new UsuarioController()
