import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import "dotenv/config"
import Fastify from 'fastify'
import { db } from './config/database'
import { errorHandler } from './middlewares/errorHandler'
import { registerRoutes } from './routes/server'

const app = Fastify({ logger: true })

app.setErrorHandler(errorHandler)

app.register(cors, { origin: true })
app.register(jwt, {
    secret: process.env.JWT_ACESS_SECRET || 'fallback_secret',
})

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'API Orbe',
            version: '1.0.0'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    }
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.get('/helth', async () => {
    const result = db.prepare('SELECT 1 as ok').get()
    return { status: 'API Orbe online', database: result }
})

app.register(registerRoutes)

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3333
        await app.listen({ port, host: '0.0.0.0' })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()