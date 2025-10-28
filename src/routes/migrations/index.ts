import { type FastifyInstance } from 'fastify'
import migrator from '../../models/migrator.js'

export default async function migratorRoute(app: FastifyInstance) {
    app.get('/migrations', async (_, reply) => {
        const pendingMigrations = await migrator.listPendingMigrations()
        reply.status(200).send({ pendingMigrations })
    })

    app.post('/migrations', async (_, reply) => {
        const migratedMigrations = await migrator.runPendingMigrations()

        if (migratedMigrations.length > 0) {
            reply.status(201).send(migratedMigrations)
        }

        reply.status(200).send(migratedMigrations)
    })
}
