import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import Fastify from 'fastify'
import { db } from './config/database'
import { errorHandler } from './middlewares/errorHandler'
import { registerRoutes } from './routes/server'

export function buildApp(secret: string, logger = false) {
    if (Buffer.byteLength(secret.trim()) < 32) {
        throw new Error('Configure JWT_ACCESS_SECRET com pelo menos 32 bytes')
    }

    const app = Fastify({ logger })
    app.setErrorHandler(errorHandler)
    app.register(cors, { origin: true })
    app.register(jwt, { secret, sign: { expiresIn: '7d' } })
    app.register(fastifySwagger, {
        openapi: {
            info: { title: 'API Orbe', version: '1.0.0' },
            security: [{ bearerAuth: [] }],
            components: {
                securitySchemes: {
                    bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                },
            },
        },
    })
    app.register(fastifySwaggerUi, { routePrefix: '/docs' })

    async function health() {
        const database = db.prepare('SELECT 1 as ok').get()
        return { status: 'API Orbe online', database }
    }

    app.get('/health', { schema: { security: [] } }, health)
    app.get('/helth', { schema: { hide: true } }, health)
    app.register(registerRoutes)
    return app
}
