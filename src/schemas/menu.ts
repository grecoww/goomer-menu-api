import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import * as z from 'zod'
import { CompleteProductSchema } from './products'
import { CompletePromotionSchema } from './promotions'

const MenuProductSchema = CompleteProductSchema.omit({
    created_at: true,
    updated_at: true,
})

const MenuPromotionSchema = CompletePromotionSchema.omit({
    product_id: true,
    created_at: true,
    updated_at: true,
})

const MenuItem = MenuProductSchema.extend({
    promotion: MenuPromotionSchema.nullable(),
})
export type MenuItem = z.infer<typeof MenuItem>

const CompleteMenuSchema = z.array(MenuItem)
export type CompleteMenu = z.infer<typeof CompleteMenuSchema>

export const MenuResponseSchema = {
    tags: ['Menu'],
    response: {
        200: {
            content: {
                'application/json': {
                    schema: CompleteMenuSchema,
                },
            },
        },
    },
} satisfies FastifyZodOpenApiSchema
