import menu from '../../models/menu'
import { MenuResponseSchema } from '../../schemas/menu'
import type { FastifyPluginAsyncZodOpenApi } from 'fastify-zod-openapi'

const plugin: FastifyPluginAsyncZodOpenApi = async (app) => {
    app.get('/menu', { schema: MenuResponseSchema }, async (_, reply) => {
        const completeMenu = await menu.view()

        reply.status(200).send(completeMenu)
    })
}

export default plugin
