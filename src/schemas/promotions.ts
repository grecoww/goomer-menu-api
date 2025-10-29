import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import * as z from 'zod'

const WeekDay = [
    'domingo',
    'segunda',
    'terca',
    'quarta',
    'quinta',
    'sexta',
    'sabado',
] as const

const PromotionInputSchema = z
    .object({
        description: z.string().max(255),
        product_id: z.int().min(1),
        promotional_price_cents: z.int().min(0),
        days_of_week: z.array(z.enum(WeekDay)),
        start_time: z.string().regex(/^([01]\d|2[0-3]):(00|15|30|45):(00)$/),
        end_time: z.string().regex(/^([01]\d|2[0-3]):(00|15|30|45):(00)$/),
    })
    .refine(({ start_time, end_time }) => end_time > start_time, {
        message: 'end_time must be greater than start_time',
        path: ['end_time'],
    })
    .strict()
export type PromotionInput = z.infer<typeof PromotionInputSchema>

export const CompletePromotionSchema = PromotionInputSchema.safeExtend({
    id: z.int().min(1),
    created_at: z.date(),
    updated_at: z.date(),
})
export type CompletePromotion = z.infer<typeof CompletePromotionSchema>

export const PromotionCreationSchema = {
    body: PromotionInputSchema,
    response: {
        201: {
            content: {
                'application/json': {
                    schema: CompletePromotionSchema,
                },
            },
        },
    },
} satisfies FastifyZodOpenApiSchema

export const PromotionListSchema = {
    response: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(CompletePromotionSchema),
                },
            },
        },
    },
} satisfies FastifyZodOpenApiSchema

export const PromotionUpdateSchema = {
    params: z.object({
        id: z.coerce.number().int().min(1),
    }),
    body: PromotionInputSchema.strict().partial(),
    response: {
        200: {
            content: {
                'application/json': {
                    schema: CompletePromotionSchema,
                },
            },
        },
        404: {
            content: {
                'application/json': {
                    schema: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
        400: {
            content: {
                'application/json': {
                    schema: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
    },
} satisfies FastifyZodOpenApiSchema

export const PromotionRemoveSchema = {
    params: z.object({
        id: z.coerce.number().int().min(1),
    }),
    response: {
        204: {
            content: {
                'application/json': {
                    schema: z.undefined(),
                },
            },
        },
        404: {
            content: {
                'application/json': {
                    schema: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
    },
} satisfies FastifyZodOpenApiSchema
