import type { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import * as z from 'zod'

const ProductCategory = [
    'entradas',
    'pratos_principais',
    'sobremesas',
    'bebidas',
] as const

export const ProductInputSchema = {
    body: z.object({
        name: z.string().max(255),
        price_cents: z.int().min(0),
        category: z.enum(ProductCategory),
        visibility: z.boolean(),
    }),
} satisfies FastifyZodOpenApiSchema

export type ProductInput = z.infer<typeof ProductInputSchema.body>
