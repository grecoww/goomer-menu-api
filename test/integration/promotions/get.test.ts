import orchestrator from '../../orchestrator'
import promotion from '../../../src/models/promotion'
import type { PromotionInput } from '../../../src/schemas/promotions'
import type { ProductInput } from '../../../src/schemas/products'
import product from '../../../src/models/product'

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

const productInfo2: ProductInput = {
    name: 'Dadinho de tapioca',
    price_cents: 30000,
    category: 'entradas',
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

const promotionInfo2: PromotionInput = {
    description: 'Pague o dobro hihi!',
    product_id: 2,
    promotional_price_cents: 60000,
    days_of_week: ['sexta', 'sabado', 'domingo'],
    start_time: '19:30:00',
    end_time: '23:45:00',
}

describe('Retrieve all the promotions', () => {
    test('No promotions available', async () => {
        const response = await fetch('http://localhost:3000/promotions')
        const data = await response.json()
        expect(data).toEqual([])
    })

    test('One promotion is available', async () => {
        await product.create(productInfo1)
        await promotion.create(promotionInfo1)
        const response = await fetch('http://localhost:3000/promotions')
        const data = await response.json()
        expect(data.length).toBe(1)
        expect(data[0]).toEqual(expect.objectContaining(promotionInfo1))
    })

    test('Two promotions are available', async () => {
        await product.create(productInfo2)
        await promotion.create(promotionInfo2)
        const response = await fetch('http://localhost:3000/promotions')
        const data = await response.json()
        expect(data.length).toBe(2)
        expect(data[1]).toEqual(expect.objectContaining(promotionInfo2))
    })
})
