import { type FastifyInstance } from 'fastify'
import statusRoute from './status'

export default async function registerRoutes(app: FastifyInstance) {
    await app.register(statusRoute)
}
