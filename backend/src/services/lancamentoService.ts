import { db } from '../config/database'
import { AppError, NotFoundError } from '../middlewares/errorHandler'

export type LancamentoTipo = 'renda' | 'gasto'
export type FormaPagamento = 'pix' | 'debito' | 'credito' | 'dinheiro'

export interface Lancamento {
  id: number
  usuario_id: number
  categoria_id: number
  tipo: LancamentoTipo
  valor_centavos: number
  descricao: string
  data: string
  forma_pagamento: FormaPagamento | null
  observacao: string | null
  criado_em: string
}

export interface CreateLancamentoDTO {
  usuario_id: number
  categoria_id: number
  tipo: LancamentoTipo
  valor_centavos: number
  descricao: string
  data: string
  forma_pagamento?: FormaPagamento | null
  observacao?: string | null
}

export interface UpdateLancamentoDTO {
  categoria_id?: number
  tipo?: LancamentoTipo
  valor_centavos?: number
  descricao?: string
  data?: string
  forma_pagamento?: FormaPagamento | null
  observacao?: string | null
}

export interface ListLancamentoFilter {
  usuario_id: number
  categoria_id?: number
  tipo?: LancamentoTipo
  data_inicio?: string
  data_fim?: string
  forma_pagamento?: FormaPagamento
  limit: number
  offset: number
}

export class LancamentoService {
  async create(data: CreateLancamentoDTO) {
    if (data.tipo === 'renda' && data.forma_pagamento) {
      throw new AppError('Lançamentos do tipo renda não devem ter forma de pagamento', 400)
    }

    if (data.tipo === 'gasto' && !data.forma_pagamento) {
      throw new AppError('Lançamentos do tipo gasto exigem forma de pagamento', 400)
    }

    const stmt = db.prepare(`
      INSERT INTO lancamentos (
        usuario_id,
        categoria_id,
        tipo,
        valor_centavos,
        descricao,
        data,
        forma_pagamento,
        observacao
      )
      VALUES (
        :usuario_id,
        :categoria_id,
        :tipo,
        :valor_centavos,
        :descricao,
        :data,
        :forma_pagamento,
        :observacao
      )
    `)

    const result = stmt.run({
      usuario_id: data.usuario_id,
      categoria_id: data.categoria_id,
      tipo: data.tipo,
      valor_centavos: data.valor_centavos,
      descricao: data.descricao.trim(),
      data: data.data,
      forma_pagamento: data.tipo === 'gasto' ? data.forma_pagamento : null,
      observacao: data.observacao ? data.observacao.trim() : null,
    })

    return this.getById(Number(result.lastInsertRowid), data.usuario_id)
  }

  async list(filters: ListLancamentoFilter) {
    const whereClauses = ['l.usuario_id = ?']
    const params: (number | string)[] = [filters.usuario_id]

    if (filters.categoria_id !== undefined) {
      whereClauses.push('l.categoria_id = ?')
      params.push(filters.categoria_id)
    }

    if (filters.tipo !== undefined) {
      whereClauses.push('l.tipo = ?')
      params.push(filters.tipo)
    }

    if (filters.data_inicio !== undefined) {
      whereClauses.push('l.data >= ?')
      params.push(filters.data_inicio)
    }

    if (filters.data_fim !== undefined) {
      whereClauses.push('l.data <= ?')
      params.push(filters.data_fim)
    }

    if (filters.forma_pagamento !== undefined) {
      whereClauses.push('l.forma_pagamento = ?')
      params.push(filters.forma_pagamento)
    }

    const whereSql = `WHERE ${whereClauses.join(' AND ')}`

    const countStmt = db.prepare(`
      SELECT COUNT(*) as total
      FROM lancamentos l
      ${whereSql}
    `)
    const total = (countStmt.get(...params) as { total: number }).total

    const queryParams = [...params, filters.limit, filters.offset]
    const listStmt = db.prepare(`
      SELECT
        l.id,
        l.usuario_id,
        l.categoria_id,
        c.nome AS categoria_nome,
        l.tipo,
        l.valor_centavos,
        l.descricao,
        l.data,
        l.forma_pagamento,
        l.observacao,
        l.criado_em
      FROM lancamentos l
      JOIN categorias c ON c.id = l.categoria_id
      ${whereSql}
      ORDER BY l.data DESC, l.id DESC
      LIMIT ? OFFSET ?
    `)
    const items = listStmt.all(...queryParams)

    return {
      total,
      limit: filters.limit,
      offset: filters.offset,
      items,
    }
  }

  async getById(id: number, usuarioId: number) {
    const stmt = db.prepare(`
      SELECT
        l.id,
        l.usuario_id,
        l.categoria_id,
        c.nome AS categoria_nome,
        l.tipo,
        l.valor_centavos,
        l.descricao,
        l.data,
        l.forma_pagamento,
        l.observacao,
        l.criado_em
      FROM lancamentos l
      JOIN categorias c ON c.id = l.categoria_id
      WHERE l.id = ? AND l.usuario_id = ?
    `)
    const item = stmt.get(id, usuarioId)
    if (!item) {
      throw new NotFoundError('Lançamento não encontrado')
    }
    return item
  }

  async update(id: number, usuarioId: number, data: UpdateLancamentoDTO) {
    const current = (await this.getById(id, usuarioId)) as Lancamento

    const tipoFinal = data.tipo !== undefined ? data.tipo : current.tipo
    let formaPagamentoFinal = data.forma_pagamento !== undefined ? data.forma_pagamento : current.forma_pagamento

    if (tipoFinal === 'renda') {
      formaPagamentoFinal = null
    } else if (tipoFinal === 'gasto' && !formaPagamentoFinal) {
      throw new AppError('Lançamentos do tipo gasto exigem forma de pagamento', 400)
    }

    const updates: string[] = []
    const values: any[] = []

    if (data.categoria_id !== undefined) {
      updates.push('categoria_id = ?')
      values.push(data.categoria_id)
    }

    if (data.tipo !== undefined) {
      updates.push('tipo = ?')
      values.push(data.tipo)
    }

    if (data.valor_centavos !== undefined) {
      updates.push('valor_centavos = ?')
      values.push(data.valor_centavos)
    }

    if (data.descricao !== undefined) {
      updates.push('descricao = ?')
      values.push(data.descricao.trim())
    }

    if (data.data !== undefined) {
      updates.push('data = ?')
      values.push(data.data)
    }

    updates.push('forma_pagamento = ?')
    values.push(formaPagamentoFinal)

    if (data.observacao !== undefined) {
      updates.push('observacao = ?')
      values.push(data.observacao ? data.observacao.trim() : null)
    }

    values.push(id, usuarioId)
    const sql = `UPDATE lancamentos SET ${updates.join(', ')} WHERE id = ? AND usuario_id = ?`
    db.prepare(sql).run(...values)

    return this.getById(id, usuarioId)
  }

  async delete(id: number, usuarioId: number) {
    const result = db.prepare('DELETE FROM lancamentos WHERE id = ? AND usuario_id = ?').run(id, usuarioId)
    if (result.changes === 0) throw new NotFoundError('Lançamento não encontrado')
    return { success: true }
  }
}

export const lancamentoService = new LancamentoService()
