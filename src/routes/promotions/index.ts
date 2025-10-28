import promotion from '../../models/promotion'
import {
    PromotionListSchema,
    PromotionCreationSchema,
    PromotionRemoveSchema,
    PromotionUpdateSchema,
} from '../../schemas/promotions'
import type { FastifyPluginAsyncZodOpenApi } from 'fastify-zod-openapi'

const plugin: FastifyPluginAsyncZodOpenApi = async (app) => {
    app.post(
        '/promotions',
        { schema: PromotionCreationSchema },
        async (request, reply) => {
            const userInputValues = request.body
            const createdPromotion = await promotion.create(userInputValues)

            reply.status(201).send(createdPromotion)
        }
    )

    app.get(
        '/promotions',
        { schema: PromotionListSchema },
        async (_, reply) => {
            const promotionList = await promotion.list()

            reply.status(200).send(promotionList)
        }
    )

    app.patch(
        '/promotions/:id',
        { schema: PromotionUpdateSchema },
        async (request, reply) => {
            const id = Number(request.params.id)
            const userInputValues = request.body

            if (Object.keys(userInputValues).length === 0) {
                return reply.status(400).send({
                    error: 'At least one field must be provided for update',
                })
            }

            const updatedPromotion = await promotion.update(id, userInputValues)

            if (!updatedPromotion) {
                return reply.status(404).send({ error: 'Promotion not found' })
            }

            reply.status(200).send(updatedPromotion)
        }
    )

    app.delete(
        '/promotions/:id',
        { schema: PromotionRemoveSchema },
        async (request, reply) => {
            const id = Number(request.params.id)
            const removed = await promotion.remove(id)

            if (!removed) {
                return reply.status(404).send({ error: 'Promotion not found' })
            }

            reply.status(204).send()
        }
    )
}

export default plugin
