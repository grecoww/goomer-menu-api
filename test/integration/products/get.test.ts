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

const productInfo2: ProductInput = {
    name: 'Dadinho de tapioca',
    price_cents: 30000,
    category: 'entradas',
    visibility: true,
}

describe('Retrieve all the products', () => {
    test('No products avaliable', async () => {
        const response = await fetch('http://localhost:3000/products')
        const data = await response.json()
        expect(data).toEqual([])
    })

    test('One product is avaliable', async () => {
        await product.create(productInfo1)
        const response = await fetch('http://localhost:3000/products')
        const data = await response.json()
        expect(data.length).toBe(1)
        expect(data[0]).toEqual(expect.objectContaining(productInfo1))
    })

    test('Two products are avaliable', async () => {
        await product.create(productInfo2)
        const response = await fetch('http://localhost:3000/products')
        const data = await response.json()
        expect(data.length).toBe(2)
        expect(data[1]).toEqual(expect.objectContaining(productInfo2))
    })
})
