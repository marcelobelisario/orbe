import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { consultaService } from '../services/consultaService'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

const saldoQuerySchema = z.object({
  usuario_id: z.coerce.number().int().positive('usuario_id deve ser um inteiro positivo'),
  ate_data: z.string().regex(dateRegex, 'ate_data deve estar no formato AAAA-MM-DD'),
})

const mesRangeQuerySchema = z.object({
  usuario_id: z.coerce.number().int().positive('usuario_id deve ser um inteiro positivo'),
  inicio_mes: z.string().regex(dateRegex, 'inicio_mes deve estar no formato AAAA-MM-DD'),
  proximo_mes: z.string().regex(dateRegex, 'proximo_mes deve estar no formato AAAA-MM-DD'),
})

const recentesQuerySchema = z.object({
  usuario_id: z.coerce.number().int().positive('usuario_id deve ser um inteiro positivo'),
  ate_data: z.string().regex(dateRegex, 'ate_data deve estar no formato AAAA-MM-DD'),
  limite: z.coerce.number().int().positive().max(100).default(10),
})

const evolucaoQuerySchema = z.object({
  usuario_id: z.coerce.number().int().positive('usuario_id deve ser um inteiro positivo'),
  inicio_mes: z.string().regex(dateRegex, 'inicio_mes deve estar no formato AAAA-MM-DD'),
})

export class ConsultaController {
  async getSaldo(request: FastifyRequest, reply: FastifyReply) {
    const query = saldoQuerySchema.parse(request.query)
    const result = consultaService.getSaldoAcumulado(query.usuario_id, query.ate_data)
    return reply.status(200).send(result)
  }

  async getTotaisMensais(request: FastifyRequest, reply: FastifyReply) {
    const query = mesRangeQuerySchema.parse(request.query)
    const result = consultaService.getTotaisMensais(
      query.usuario_id,
      query.inicio_mes,
      query.proximo_mes
    )
    return reply.status(200).send(result)
  }

  async getGastosPorCategoria(request: FastifyRequest, reply: FastifyReply) {
    const query = mesRangeQuerySchema.parse(request.query)
    const result = consultaService.getGastosPorCategoria(
      query.usuario_id,
      query.inicio_mes,
      query.proximo_mes
    )
    return reply.status(200).send(result)
  }

  async getRecentes(request: FastifyRequest, reply: FastifyReply) {
    const query = recentesQuerySchema.parse(request.query)
    const result = consultaService.getLancamentosRecentes(
      query.usuario_id,
      query.ate_data,
      query.limite
    )
    return reply.status(200).send(result)
  }

  async getEvolucaoMensal(request: FastifyRequest, reply: FastifyReply) {
    const query = evolucaoQuerySchema.parse(request.query)
    const result = consultaService.getEvolucaoSeisMeses(query.usuario_id, query.inicio_mes)
    return reply.status(200).send(result)
  }
}

export const consultaController = new ConsultaController()
