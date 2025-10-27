import { type FastifyInstance } from 'fastify'

export default async function statusRoute(app: FastifyInstance) {
    app.get('/status', async (_, reply) => {
        reply.code(200).send({ status: 'alive' })
    })
}
