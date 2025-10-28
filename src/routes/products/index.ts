import product from '../../models/product'
import {
    ProductCreationSchema,
    ProductListSchema,
    ProductUpdateSchema,
    ProductRemoveSchema,
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

    app.patch(
        '/products/:id',
        { schema: ProductUpdateSchema },
        async (request, reply) => {
            const id = Number(request.params.id)
            const userInputValues = request.body

            if (Object.keys(userInputValues).length === 0) {
                return reply.status(400).send({
                    error: 'At least one field must be provided for update',
                })
            }

            const updatedProduct = await product.update(id, userInputValues)

            if (!updatedProduct) {
                return reply.status(404).send({ error: 'Product not found' })
            }

            reply.status(200).send(updatedProduct)
        }
    )

    app.delete(
        '/products/:id',
        { schema: ProductRemoveSchema },
        async (request, reply) => {
            const id = Number(request.params.id)
            const removed = await product.remove(id)

            if (!removed) {
                return reply.status(404).send({ error: 'Product not found' })
            }

            reply.status(204).send()
        }
    )
}

export default plugin
