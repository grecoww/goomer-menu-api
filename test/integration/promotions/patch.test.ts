import orchestrator from '../../orchestrator'
import promotion from '../../../src/models/promotion'
import product from '../../../src/models/product'
import type { PromotionInput } from '../../../src/schemas/promotions'
import type { ProductInput } from '../../../src/schemas/products'

beforeAll(async () => {
    await orchestrator.waitForAllServices()
    await orchestrator.clearDatabase()
    await orchestrator.runPendingMigrations()
})

const productInfo1: ProductInput = {
    name: 'Cervejinha',
    price_cents: 1500,
    category: 'bebidas',
    visibility: true,
}

const promotionInfo1: PromotionInput = {
    description: 'Leve 2 Pague 1!',
    product_id: 1,
    promotional_price_cents: 750,
    days_of_week: ['sexta', 'sabado', 'domingo'],
    start_time: '08:00:00',
    end_time: '20:00:00',
}

describe('Update a promotion', () => {
    test('Update existing promotion', async () => {
        await product.create(productInfo1)
        const created = await promotion.create(promotionInfo1)
        const patchResponse = await fetch(
            `http://localhost:3000/promotions/${created.id}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: 'Promocao de Inverno' }),
            }
        )
        expect(patchResponse.status).toBe(200)
        const updated = await patchResponse.json()
        expect(updated.description).toBe('Promocao de Inverno')
        expect(updated.id).toBe(created.id)
    })

    test('Update non-existing promotion returns 404', async () => {
        const patchResponse = await fetch(
            'http://localhost:3000/promotions/9999',
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: 'Qualquer' }),
            }
        )
        expect(patchResponse.status).toBe(404)
        const error = await patchResponse.json()
        expect(error).toHaveProperty('error')
    })

    test('Update with empty body returns 400', async () => {
        const created = await promotion.create(promotionInfo1)
        const patchResponse = await fetch(
            `http://localhost:3000/promotions/${created.id}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            }
        )
        expect(patchResponse.status).toBe(400)
        const error = await patchResponse.json()
        expect(error).toHaveProperty('error')
    })

    test('Update with invalid field returns 400', async () => {
        const created = await promotion.create(promotionInfo1)
        const patchResponse = await fetch(
            `http://localhost:3000/promotions/${created.id}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invalidField: 'value' }),
            }
        )
        expect(patchResponse.status).toBe(500)
    })

    test('Update multiple fields', async () => {
        const created = await promotion.create(promotionInfo1)
        const patchResponse = await fetch(
            `http://localhost:3000/promotions/${created.id}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: 'Promocao Especial',
                    promotional_price_cents: 20,
                    days_of_week: ['segunda', 'terca'],
                }),
            }
        )
        expect(patchResponse.status).toBe(200)
        const updated = await patchResponse.json()
        expect(updated.description).toBe('Promocao Especial')
        expect(updated.promotional_price_cents).toBe(20)
        expect(updated.days_of_week).toEqual(['segunda', 'terca'])
        expect(updated.id).toBe(created.id)
    })
})
