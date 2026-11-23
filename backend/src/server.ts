import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import "dotenv/config"
import Fastify from 'fastify'
import { db } from './config/database'

const app = Fastify({ logger: true })

app.register(cors, { origin: true })
app.register(jwt, {
    secret: process.env.JWT_ACESS_SECRET || 'fallback_secret',
})

app.get('/helth', async () => {
    const result = db.prepare('SELECT 1 as ok').get()
    return { status: 'API Orbe online', database: result }
})

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