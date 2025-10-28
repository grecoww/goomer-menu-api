import database from '../../infra/database'
import type { CompletePromotion, PromotionInput } from '../schemas/promotions'

async function create(
    userInputValues: PromotionInput
): Promise<CompletePromotion> {
    const response = await database.query({
        text: `INSERT INTO 
                promotions
            (description, promotional_price_cents, product_id, days_of_week, start_time, end_time)
                VALUES
            ($1,$2,$3,$4,$5,$6)
                RETURNING
            id, description, promotional_price_cents, product_id, array_to_json(days_of_week) AS days_of_week, start_time, end_time, created_at, updated_at
                ;
            `,
        values: [
            userInputValues.description,
            userInputValues.promotional_price_cents,
            userInputValues.product_id,
            userInputValues.days_of_week,
            userInputValues.start_time,
            userInputValues.end_time,
        ],
    })

    return response.rows[0]
}

async function list(): Promise<CompletePromotion[]> {
    const response = await database.query(`
        SELECT
        id, description, promotional_price_cents, product_id, array_to_json(days_of_week) AS days_of_week, start_time, end_time, created_at, updated_at
        from 
        promotions
        ;
        `)

    return response.rows
}

async function update(
    id: number,
    userInputValues: Partial<PromotionInput>
): Promise<CompletePromotion | null> {
    const fields = []
    const values = []
    let idx = 1

    for (const [key, value] of Object.entries(userInputValues)) {
        fields.push(`${key} = $${idx}`)
        values.push(value)
        idx++
    }
    values.push(id)

    const response = await database.query({
        text: `
            UPDATE promotions
            SET ${fields.join(', ')}
            WHERE id = $${idx}
            RETURNING
            id, description, promotional_price_cents, product_id, array_to_json(days_of_week) AS days_of_week, start_time, end_time, created_at, updated_at
            ;
        `,
        values,
    })

    return response.rows[0] || null
}

async function remove(id: number): Promise<boolean> {
    const response = await database.query({
        text: `
            DELETE FROM promotions
            WHERE id = $1
            RETURNING id;
        `,
        values: [id],
    })

    return (response.rowCount ?? 0) > 0
}

const promotion = {
    create,
    list,
    update,
    remove,
}

export default promotion
