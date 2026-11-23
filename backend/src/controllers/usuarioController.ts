import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { NotFoundError } from '../middlewares/errorHandler'
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

const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha obrigatória'),
})

const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um inteiro positivo'),
})

const listUsuarioQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

function getOwnAccountId(request: FastifyRequest) {
  const { id } = idParamSchema.parse(request.params)
  if (id !== Number(request.user.sub)) {
    throw new NotFoundError('Usuário não encontrado')
  }
  return id
}

export class UsuarioController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = createUsuarioSchema.parse(request.body)
    const user = await usuarioService.create(data)
    return reply.status(201).send(user)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = listUsuarioQuerySchema.parse(request.query)
    const result = await usuarioService.list(Number(request.user.sub), query)
    return reply.status(200).send(result)
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const id = getOwnAccountId(request)
    const user = await usuarioService.getById(id)
    return reply.status(200).send(user)
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const id = getOwnAccountId(request)
    const data = updateUsuarioSchema.parse(request.body)
    const updated = await usuarioService.update(id, data)
    return reply.status(200).send(updated)
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const id = getOwnAccountId(request)
    await usuarioService.delete(id)
    return reply.status(204).send()
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(request.body)
    const user = await usuarioService.authenticate(data.email, data.senha)
    const token = await reply.jwtSign({ sub: String(user.id), accountCreatedAt: user.criado_em })
    return reply.status(200).send({ user, token })
  }
}

export const usuarioController = new UsuarioController()
