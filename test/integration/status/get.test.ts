import orchestrator from '../../orchestrator'

beforeAll(async () => {
    await orchestrator.waitForAllServices()
})

describe('Essential status tests', () => {
    test('Retrieving status', async () => {
        const response = await fetch('http://localhost:3000/status')
        expect(response.status).toBe(200)

        const responseBody = await response.json()
        expect(responseBody).toHaveProperty('status')
        expect(responseBody.status).toBe('alive')
    })

    test('Not Found error', async () => {
        const response = await fetch('http://localhost:3000/la-li-lu-le-lo')
        expect(response.status).toBe(404)

        const responseBody = await response.json()
        expect(responseBody).toHaveProperty('message')
        expect(responseBody.message).toBe('Not found')
    })
})
