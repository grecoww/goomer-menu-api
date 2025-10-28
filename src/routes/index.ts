import { type FastifyInstance } from 'fastify'
import statusRoute from './status'
import migratorRoute from './migrations'

export default async function registerRoutes(app: FastifyInstance) {
    await app.register(statusRoute)
    await app.register(migratorRoute)
}
