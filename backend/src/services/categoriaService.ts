import { db } from '../config/database'
import { NotFoundError } from '../middlewares/errorHandler'

export type CategoriaTipo = 'renda' | 'gasto'

export interface Categoria {
  id: number
  usuario_id: number
  tipo: CategoriaTipo
  nome: string
  criado_em: string
}

export interface CreateCategoriaDTO {
  usuario_id: number
  tipo: CategoriaTipo
  nome: string
}

export interface UpdateCategoriaDTO {
  tipo?: CategoriaTipo
  nome?: string
}

export interface ListCategoriaFilter {
  usuario_id?: number
  tipo?: CategoriaTipo
  nome?: string
  limit: number
  offset: number
}

export class CategoriaService {
  async create(data: CreateCategoriaDTO) {
    const stmt = db.prepare(`
      INSERT INTO categorias (usuario_id, tipo, nome)
      VALUES (?, ?, ?)
    `)

    const result = stmt.run(data.usuario_id, data.tipo, data.nome.trim())
    return this.getById(Number(result.lastInsertRowid))
  }

  async list(filters: ListCategoriaFilter) {
    const whereClauses: string[] = []
    const params: any[] = []

    if (filters.usuario_id !== undefined) {
      whereClauses.push('usuario_id = ?')
      params.push(filters.usuario_id)
    }

    if (filters.tipo !== undefined) {
      whereClauses.push('tipo = ?')
      params.push(filters.tipo)
    }

    if (filters.nome !== undefined && filters.nome.trim() !== '') {
      whereClauses.push('nome LIKE ?')
      params.push(`%${filters.nome.trim()}%`)
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM categorias ${whereSql}`)
    const total = (countStmt.get(...params) as { total: number }).total

    const queryParams = [...params, filters.limit, filters.offset]
    const listStmt = db.prepare(`
      SELECT id, usuario_id, tipo, nome, criado_em
      FROM categorias
      ${whereSql}
      ORDER BY id ASC
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

  async getById(id: number) {
    const stmt = db.prepare(`
      SELECT id, usuario_id, tipo, nome, criado_em
      FROM categorias
      WHERE id = ?
    `)
    const item = stmt.get(id)
    if (!item) {
      throw new NotFoundError('Categoria não encontrada')
    }
    return item
  }

  async update(id: number, data: UpdateCategoriaDTO) {
    await this.getById(id)

    const updates: string[] = []
    const values: any[] = []

    if (data.tipo !== undefined) {
      updates.push('tipo = ?')
      values.push(data.tipo)
    }

    if (data.nome !== undefined) {
      updates.push('nome = ?')
      values.push(data.nome.trim())
    }

    if (updates.length > 0) {
      values.push(id)
      const sql = `UPDATE categorias SET ${updates.join(', ')} WHERE id = ?`
      db.prepare(sql).run(...values)
    }

    return this.getById(id)
  }

  async delete(id: number) {
    await this.getById(id)
    const stmt = db.prepare('DELETE FROM categorias WHERE id = ?')
    stmt.run(id)
    return { success: true }
  }
}

export const categoriaService = new CategoriaService()
