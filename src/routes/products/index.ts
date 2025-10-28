import product from '../../models/product'
import { ProductInputSchema } from '../../schemas/products'
import type { FastifyPluginAsyncZodOpenApi } from 'fastify-zod-openapi'

const plugin: FastifyPluginAsyncZodOpenApi = async (app) => {
    app.post(
        '/products',
        { schema: ProductInputSchema },
        async (request, reply) => {
            const userInputValues = request.body
            const createdProduct = await product.create(userInputValues)

            reply.status(201).send(createdProduct)
        }
    )
}

export default plugin
