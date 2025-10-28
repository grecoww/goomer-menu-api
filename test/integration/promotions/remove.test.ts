import orchestrator from '../../orchestrator'
import product from '../../../src/models/product'
import type { ProductInput } from '../../../src/schemas/products'
import promotion from '../../../src/models/promotion'
import type { PromotionInput } from '../../../src/schemas/promotions'

beforeAll(async () => {
    await orchestrator.waitForAllServices()
    await orchestrator.clearDatabase()
    await orchestrator.runPendingMigrations()
})

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

describe('Remove a promotion', () => {
    test('Remove existing promotion', async () => {
        await product.create(productInfo1)
        const created = await promotion.create(promotionInfo1)
        const response = await fetch(
            `http://localhost:3000/promotions/${created.id}`,
            {
                method: 'DELETE',
            }
        )
        expect(response.status).toBe(204)

        const listResponse = await fetch('http://localhost:3000/promotions')
        const data = await listResponse.json()
        expect(data).toEqual([])
    })

    test('Remove non-existing promotion returns 404', async () => {
        const response = await fetch('http://localhost:3000/promotions/9999', {
            method: 'DELETE',
        })
        expect(response.status).toBe(404)
        const error = await response.json()
        expect(error).toHaveProperty('error')
    })
})
