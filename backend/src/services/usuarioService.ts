import bcrypt from 'bcrypt'
import { db } from '../config/database'
import { NotFoundError } from '../middlewares/errorHandler'

export interface Usuario {
  id: number
  nome_completo: string
  email: string
  senha_hash: string
  criado_em: string
}

export interface CreateUsuarioDTO {
  nome_completo: string
  email: string
  senha: string
}

export interface UpdateUsuarioDTO {
  nome_completo?: string
  email?: string
  senha?: string
}

export interface PaginationParams {
  limit: number
  offset: number
}

export class UsuarioService {
  async create(data: CreateUsuarioDTO) {
    const senhaHash = await bcrypt.hash(data.senha, 10)
    const stmt = db.prepare(`
      INSERT INTO usuarios (nome_completo, email, senha_hash)
      VALUES (?, ?, ?)
    `)

    const result = stmt.run(data.nome_completo.trim(), data.email.trim(), senhaHash)
    return this.getById(Number(result.lastInsertRowid))
  }

  async list({ limit, offset }: PaginationParams) {
    const countStmt = db.prepare('SELECT COUNT(*) as total FROM usuarios')
    const total = (countStmt.get() as { total: number }).total

    const stmt = db.prepare(`
      SELECT id, nome_completo, email, criado_em
      FROM usuarios
      ORDER BY id ASC
      LIMIT ? OFFSET ?
    `)
    const items = stmt.all(limit, offset)

    return {
      total,
      limit,
      offset,
      items,
    }
  }

  async getById(id: number) {
    const stmt = db.prepare(`
      SELECT id, nome_completo, email, criado_em
      FROM usuarios
      WHERE id = ?
    `)
    const user = stmt.get(id)
    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }
    return user
  }

  async update(id: number, data: UpdateUsuarioDTO) {
    await this.getById(id)

    const updates: string[] = []
    const values: any[] = []

    if (data.nome_completo !== undefined) {
      updates.push('nome_completo = ?')
      values.push(data.nome_completo.trim())
    }

    if (data.email !== undefined) {
      updates.push('email = ?')
      values.push(data.email.trim())
    }

    if (data.senha !== undefined) {
      const senhaHash = await bcrypt.hash(data.senha, 10)
      updates.push('senha_hash = ?')
      values.push(senhaHash)
    }

    if (updates.length > 0) {
      values.push(id)
      const sql = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`
      db.prepare(sql).run(...values)
    }

    return this.getById(id)
  }

  async delete(id: number) {
    await this.getById(id)
    const stmt = db.prepare('DELETE FROM usuarios WHERE id = ?')
    stmt.run(id)
    return { success: true }
  }
}

export const usuarioService = new UsuarioService()
