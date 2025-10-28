import { type FastifyInstance } from 'fastify'
import statusRoute from './status'
import migratorRoute from './migrations'
import productsRoute from './products'
import promotionsRoute from './promotions'

export default async function registerRoutes(app: FastifyInstance) {
    await app.register(statusRoute)
    await app.register(migratorRoute)
    await app.register(productsRoute)
    await app.register(promotionsRoute)
}
