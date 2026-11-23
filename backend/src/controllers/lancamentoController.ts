import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { lancamentoService } from '../services/lancamentoService'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

const createLancamentoSchema = z
  .object({
    categoria_id: z.coerce.number().int().positive('ID da categoria deve ser um inteiro positivo'),
    tipo: z.enum(['renda', 'gasto'], { error: 'Tipo deve ser renda ou gasto' }),
    valor_centavos: z.coerce.number().int().positive('Valor deve ser um inteiro positivo em centavos'),
    descricao: z.string().trim().min(1, 'Descrição não pode ser vazia'),
    data: z.string().regex(dateRegex, 'Data deve estar no formato AAAA-MM-DD'),
    forma_pagamento: z.enum(['pix', 'debito', 'credito', 'dinheiro']).nullable().optional(),
    observacao: z.string().trim().nullable().optional(),
  })
  .refine(
    (val) => {
      if (val.tipo === 'renda') {
        return val.forma_pagamento === undefined || val.forma_pagamento === null
      }
      return val.forma_pagamento !== undefined && val.forma_pagamento !== null
    },
    {
      message: "Para 'renda', forma_pagamento deve ser nula. Para 'gasto', forma_pagamento é obrigatória (pix, debito, credito, dinheiro)",
      path: ['forma_pagamento'],
    }
  )

const updateLancamentoSchema = z
  .object({
    categoria_id: z.coerce.number().int().positive().optional(),
    tipo: z.enum(['renda', 'gasto']).optional(),
    valor_centavos: z.coerce.number().int().positive().optional(),
    descricao: z.string().trim().min(1).optional(),
    data: z.string().regex(dateRegex, 'Data deve estar no formato AAAA-MM-DD').optional(),
    forma_pagamento: z.enum(['pix', 'debito', 'credito', 'dinheiro']).nullable().optional(),
    observacao: z.string().trim().nullable().optional(),
  })
  .refine(
    (val) => {
      if (val.tipo === 'renda' && val.forma_pagamento) {
        return false
      }
      return true
    },
    {
      message: "Para 'renda', forma_pagamento não pode ser informada",
      path: ['forma_pagamento'],
    }
  )

const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um inteiro positivo'),
})

const listLancamentoQuerySchema = z.object({
  categoria_id: z.coerce.number().int().positive().optional(),
  tipo: z.enum(['renda', 'gasto']).optional(),
  data_inicio: z.string().regex(dateRegex).optional(),
  data_fim: z.string().regex(dateRegex).optional(),
  forma_pagamento: z.enum(['pix', 'debito', 'credito', 'dinheiro']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export class LancamentoController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = createLancamentoSchema.parse(request.body)
    const lancamento = await lancamentoService.create({ ...data, usuario_id: Number(request.user.sub) })
    return reply.status(201).send(lancamento)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const query = listLancamentoQuerySchema.parse(request.query)
    const result = await lancamentoService.list({ ...query, usuario_id: Number(request.user.sub) })
    return reply.status(200).send(result)
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params)
    const item = await lancamentoService.getById(id, Number(request.user.sub))
    return reply.status(200).send(item)
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params)
    const data = updateLancamentoSchema.parse(request.body)
    const updated = await lancamentoService.update(id, Number(request.user.sub), data)
    return reply.status(200).send(updated)
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamSchema.parse(request.params)
    await lancamentoService.delete(id, Number(request.user.sub))
    return reply.status(204).send()
  }
}

export const lancamentoController = new LancamentoController()
