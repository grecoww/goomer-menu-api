import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import * as z from 'zod'

const ProductCategory = [
    'entradas',
    'pratos_principais',
    'sobremesas',
    'bebidas',
] as const

const ProductInputSchema = z.object({
    name: z.string().max(255),
    price_cents: z.int().min(0),
    category: z.enum(ProductCategory),
    visibility: z.boolean(),
})
export type ProductInput = z.infer<typeof ProductInputSchema>

const CompleteProductSchema = ProductInputSchema.extend({
    id: z.int().min(1),
    created_at: z.date(),
    updated_at: z.date(),
})
export type CompleteProduct = z.infer<typeof CompleteProductSchema>

export const ProductCreationSchema = {
    body: ProductInputSchema,
    response: {
        201: {
            content: {
                'application/json': {
                    schema: CompleteProductSchema,
                },
            },
        },
    },
} satisfies FastifyZodOpenApiSchema

export const ProductListSchema = {
    response: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(CompleteProductSchema),
                },
            },
        },
    },
} satisfies FastifyZodOpenApiSchema

export const ProductUpdateSchema = {
    params: z.object({
        id: z.coerce.number().int().min(1),
    }),
    body: ProductInputSchema.partial(),
    response: {
        200: {
            content: {
                'application/json': {
                    schema: CompleteProductSchema,
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

export const ProductRemoveSchema = {
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
