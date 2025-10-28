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

describe('Update a product', () => {
    test('Update existing product', async () => {
        const created = await product.create(productInfo1)
        const patchResponse = await fetch(
            `http://localhost:3000/products/${created.id}`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Cervejona' }),
            }
        )
        expect(patchResponse.status).toBe(200)
        const updated = await patchResponse.json()
        expect(updated.name).toBe('Cervejona')
        expect(updated.id).toBe(created.id)
    })

    test('Update non-existing product returns 404', async () => {
        const patchResponse = await fetch(
            'http://localhost:3000/products/9999',
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Qualquer' }),
            }
        )
        expect(patchResponse.status).toBe(404)
        const error = await patchResponse.json()
        expect(error).toHaveProperty('error')
    })

    test('Update with empty body returns 400', async () => {
        const created = await product.create(productInfo1)
        const patchResponse = await fetch(
            `http://localhost:3000/products/${created.id}`,
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
})
