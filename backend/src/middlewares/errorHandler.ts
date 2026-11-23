import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

export class AppError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Registro não encontrado') {
    super(message, 404)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Credenciais inválidas') {
    super(message, 401)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito de dados') {
    super(message, 409)
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Erro de validação nos dados fornecidos',
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    })
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    })
  }

  const err = error as any
  const errCode = err.code || ''
  const errMsg = err.message || ''

  if (errCode === 'SQLITE_CONSTRAINT_UNIQUE' || errMsg.includes('UNIQUE constraint failed')) {
    return reply.status(409).send({
      statusCode: 409,
      error: 'Conflict',
      message: 'Restrição de unicidade violada: registro já cadastrado',
      detail: errMsg,
    })
  }

  if (errCode === 'SQLITE_CONSTRAINT_FOREIGNKEY' || errMsg.includes('FOREIGN KEY constraint failed')) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Restrição de chave estrangeira violada: relacionamento inválido ou dependente',
      detail: errMsg,
    })
  }

  if (errCode === 'SQLITE_CONSTRAINT_CHECK' || errMsg.includes('CHECK constraint failed')) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Restrição de validação (CHECK) do banco de dados violada',
      detail: errMsg,
    })
  }

  if (errCode === 'SQLITE_CONSTRAINT_NOTNULL' || errMsg.includes('NOT NULL constraint failed')) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Campo obrigatório ausente no banco de dados',
      detail: errMsg,
    })
  }

  request.log.error(error)

  const statusCode = (error as FastifyError).statusCode || 500
  return reply.status(statusCode).send({
    statusCode,
    error: 'Internal Server Error',
    message: statusCode === 500 ? 'Erro interno no servidor' : error.message,
  })
}
