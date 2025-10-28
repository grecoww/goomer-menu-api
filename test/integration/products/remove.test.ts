import orchestrator from '../../orchestrator'
import product from '../../../src/models/product'
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

describe('Remove a product', () => {
    test('Remove existing product', async () => {
        const created = await product.create(productInfo1)
        const response = await fetch(
            `http://localhost:3000/products/${created.id}`,
            {
                method: 'DELETE',
            }
        )
        expect(response.status).toBe(204)

        const listResponse = await fetch('http://localhost:3000/products')
        const data = await listResponse.json()
        expect(data).toEqual([])
    })

    test('Remove non-existing product returns 404', async () => {
        const response = await fetch('http://localhost:3000/products/9999', {
            method: 'DELETE',
        })
        expect(response.status).toBe(404)
        const error = await response.json()
        expect(error).toHaveProperty('error')
    })
})
