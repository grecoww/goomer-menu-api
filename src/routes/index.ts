import { type FastifyInstance } from 'fastify'
import statusRoute from './status'
import migratorRoute from './migrations'
import productRoute from './products'

export default async function registerRoutes(app: FastifyInstance) {
    await app.register(statusRoute)
    await app.register(migratorRoute)
    await app.register(productRoute)
}
