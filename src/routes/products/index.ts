import product from '../../models/product'
import {
    ProductCreationSchema,
    ProductListSchema,
} from '../../schemas/products'
import type { FastifyPluginAsyncZodOpenApi } from 'fastify-zod-openapi'

const plugin: FastifyPluginAsyncZodOpenApi = async (app) => {
    app.post(
        '/products',
        { schema: ProductCreationSchema },
        async (request, reply) => {
            const userInputValues = request.body
            const createdProduct = await product.create(userInputValues)

            reply.status(201).send(createdProduct)
        }
    )

    app.get('/products', { schema: ProductListSchema }, async (_, reply) => {
        const productList = await product.list()

        reply.status(200).send(productList)
    })
}

export default plugin
