import bcrypt from 'bcrypt'
import { db } from '../config/database'
import { NotFoundError, UnauthorizedError } from '../middlewares/errorHandler'

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

  async list(id: number, { limit, offset }: PaginationParams) {
    const user = await this.getById(id)
    return {
      total: 1,
      limit,
      offset,
      items: offset === 0 ? [user] : [],
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

  async findByEmail(email: string): Promise<Usuario | undefined> {
    const stmt = db.prepare(`
      SELECT id, nome_completo, email, senha_hash, criado_em
      FROM usuarios
      WHERE lower(trim(email)) = lower(trim(?))
    `)
    return stmt.get(email) as Usuario | undefined
  }

  async authenticate(email: string, senha: string) {
    const user = await this.findByEmail(email)
    if (!user) {
      throw new UnauthorizedError('E-mail ou senha inválidos')
    }

    const passwordMatch = await bcrypt.compare(senha, user.senha_hash)
    if (!passwordMatch) {
      throw new UnauthorizedError('E-mail ou senha inválidos')
    }

    const { senha_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

export const usuarioService = new UsuarioService()
