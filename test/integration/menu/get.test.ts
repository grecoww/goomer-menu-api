import orchestrator from '../../orchestrator'
import product from '../../../src/models/product'
import promotion from '../../../src/models/promotion'
import type { ProductInput } from '../../../src/schemas/products'
import type { PromotionInput } from '../../../src/schemas/promotions'
import database from '../../../infra/database'
import type { MenuItem } from '../../../src/schemas/menu'

// cria e limpa o banco antes e depois dos testes
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
    visibility: false,
}

const productInfo3: ProductInput = {
    name: 'Strogonoff',
    price_cents: 80000,
    category: 'pratos_principais',
    visibility: true,
}

const promotionInfo1: PromotionInput = {
    description: 'Happy hour',
    product_id: 1,
    promotional_price_cents: 750,
    days_of_week: [],
    start_time: '00:00:00',
    end_time: '00:00:00',
}

const promotionInfo2: PromotionInput = {
    description: 'Leve 2 Pague 1!',
    product_id: 3,
    promotional_price_cents: 750,
    days_of_week: ['segunda'],
    start_time: '00:00:00',
    end_time: '00:15:00',
}

describe('Retrieve the complete menu', () => {
    it('return only visible products', async () => {
        await product.create(productInfo1)
        await product.create(productInfo2)

        const response = await fetch('http://localhost:3000/menu')
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toHaveLength(1)
        expect(data[0].name).toBe('Cervejinha')
    })

    it('promotion=null if no promotion avaliable', async () => {
        const response = await fetch('http://localhost:3000/menu')
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data[0].promotion).toBe(null)
    })

    it('show the valid promotion when in valid time', async () => {
        const result = await database.query(`SELECT
    CASE EXTRACT(DOW FROM (NOW() AT TIME ZONE 'America/Sao_Paulo'))
        WHEN 0 THEN 'domingo'
        WHEN 1 THEN 'segunda'
        WHEN 2 THEN 'terca'
        WHEN 3 THEN 'quarta'
        WHEN 4 THEN 'quinta'
        WHEN 5 THEN 'sexta'
        WHEN 6 THEN 'sabado'
    END AS week,
    TO_CHAR(NOW() AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI:SS') AS time_now;`)

        const weekDay = result.rows[0].week
        const [hour] = result.rows[0].time_now.split(':').map(Number)

        // round the database hour to a valid interval of the promotion
        const startHour = String(hour).padStart(2, '0')
        let targetHour
        if (hour === 23) {
            targetHour = 23
        } else targetHour = hour + 1
        const endHour = String(targetHour).padStart(2, '0')

        // yes, it will not work if you are testing between 23:45 and 23:59 Lol
        const validStartTime = `${startHour}:00:00`
        const validEndTime = `${endHour}:45:00`

        await promotion.create({
            ...promotionInfo1,
            days_of_week: [weekDay],
            start_time: validStartTime,
            end_time: validEndTime,
        })

        const response = await fetch('http://localhost:3000/menu')
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data[0].promotion).not.toBeNull()
        expect(data[0].promotion.description).toContain('Happy hour')
    })

    it('ignore promotion when in invalid time', async () => {
        const productInfo = await product.create(productInfo3)
        const id = productInfo.id

        await promotion.create(promotionInfo2)

        const response = await fetch('http://localhost:3000/menu')
        const data = await response.json()

        const productIndex = data.findIndex((item: MenuItem) => item.id === id)

        expect(response.status).toBe(200)
        expect(data[productIndex].promotion).toBeNull()
    })
})
