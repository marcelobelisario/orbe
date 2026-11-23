import type { FastifyRequest } from 'fastify'
import '@fastify/jwt'
import { db } from '../config/database'
import { UnauthorizedError } from './errorHandler'

type AccountClaims = { sub: string; accountCreatedAt: string }

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: AccountClaims
    user: AccountClaims
  }
}

const findAccount = db.prepare('SELECT 1 FROM usuarios WHERE id = ? AND criado_em = ?')

export async function authenticate(request: FastifyRequest) {
  try {
    await request.jwtVerify()
  } catch {
    throw new UnauthorizedError('Sessão inválida ou expirada')
  }

  const { sub, accountCreatedAt } = request.user
  const accountId = Number(sub)
  if (
    typeof sub !== 'string' || !Number.isSafeInteger(accountId) || accountId <= 0 ||
    typeof accountCreatedAt !== 'string' || !findAccount.get(accountId, accountCreatedAt)
  ) {
    throw new UnauthorizedError('Sessão inválida ou expirada')
  }
}
