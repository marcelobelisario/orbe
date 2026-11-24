import 'dotenv/config'
import { buildApp } from './app'

async function start() {
    const app = buildApp(process.env.JWT_ACCESS_SECRET ?? '', true)
    const port = Number(process.env.PORT) || 3333
    await app.listen({ port, host: '0.0.0.0' })
}

start().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
})
