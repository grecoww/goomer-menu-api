import { type FastifyInstance } from 'fastify'
import database from '../../../infra/database'

export default async function statusRoute(app: FastifyInstance) {
    app.get('/status', async (_, reply) => {
        const response = await database.query('SHOW server_version;')
        const databaseInfo = response.rows[0].server_version
        reply
            .code(200)
            .send({ status: 'alive', database_version: databaseInfo })
    })
}
