import type { ProductInput } from '../../../src/schemas/products'
import orchestrator from '../../orchestrator'

beforeAll(async () => {
    await orchestrator.waitForAllServices()
    await orchestrator.clearDatabase()
    await orchestrator.runPendingMigrations()
})

const productInfo: ProductInput = {
    name: 'Cervejinha',
    price_cents: 1500,
    category: 'bebidas',
    visibility: true,
}

describe('Product creation', () => {
    test('Create valid product in db', async () => {
        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productInfo),
        })

        expect(response.status).toBe(201)
        const data = await response.json()

        expect(data).toEqual(expect.objectContaining(productInfo))
        expect(Number.isInteger(data.id)).toBe(true)
        expect(Date.parse(data.created_at)).not.toBeNaN()
        expect(Date.parse(data.updated_at)).not.toBeNaN()
    })

    test('Create two products with same case-insensitive name', async () => {
        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...productInfo, name: 'cervejinha' }),
        })

        expect(response.status).toBe(500)
    })
})
