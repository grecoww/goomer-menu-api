import orchestrator from '../../orchestrator'
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

const promotionInfo: PromotionInput = {
    description: 'Leve 2 Pague 1!',
    product_id: 1,
    promotional_price_cents: 750,
    days_of_week: ['sexta', 'sabado', 'domingo'],
    start_time: '08:00:00',
    end_time: '20:00:00',
}

describe('Promotion creation', () => {
    test('Create promotion with invalid product', async () => {
        const response = await fetch('http://localhost:3000/promotions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(promotionInfo),
        })

        expect(response.status).toBe(500)
    })

    test('Create valid promotion in db', async () => {
        await product.create(productInfo1)
        const response = await fetch('http://localhost:3000/promotions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(promotionInfo),
        })

        expect(response.status).toBe(201)
        const data = await response.json()

        expect(data).toEqual(expect.objectContaining(promotionInfo))
        expect(Number.isInteger(data.id)).toBe(true)
        expect(Date.parse(data.created_at)).not.toBeNaN()
        expect(Date.parse(data.updated_at)).not.toBeNaN()
    })

    test('Create promotion with missing required field returns 400', async () => {
        const { description, product_id } = promotionInfo
        const response = await fetch('http://localhost:3000/promotions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, product_id }),
        })

        expect(response.status).toBe(400)
    })

    test('Create promotion with invalid field returns 400', async () => {
        const invalidInfo = { ...promotionInfo, invalidField: 'value' }
        const response = await fetch('http://localhost:3000/promotions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invalidInfo),
        })

        expect(response.status).toBe(400)
    })

    test('Create promotion with empty body returns 400', async () => {
        const response = await fetch('http://localhost:3000/promotions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        })

        expect(response.status).toBe(400)
    })
})
