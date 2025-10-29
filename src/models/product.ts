import database from '../../infra/database'
import type { CompleteProduct, ProductInput } from '../schemas/products'

async function create(userInputValues: ProductInput): Promise<CompleteProduct> {
    const existing = await database.query({
        text: `SELECT 1 FROM products WHERE LOWER(name) = LOWER($1)`,
        values: [userInputValues.name],
    })

    if ((existing.rowCount ?? 0) > 0) {
        throw new Error('Product with this name already exists')
    }

    const response = await database.query({
        text: `INSERT INTO 
                products
            (name, price_cents, category, visibility)
                VALUES
            ($1,$2,$3,$4)
                RETURNING
                    *
                ;
            `,
        values: [
            userInputValues.name,
            userInputValues.price_cents,
            userInputValues.category,
            userInputValues.visibility,
        ],
    })

    return response.rows[0]
}

async function list(): Promise<CompleteProduct[]> {
    const response = await database.query(`
        SELECT
         * 
        from 
        products
        ;
        `)

    return response.rows
}

async function update(
    id: number,
    userInputValues: Partial<ProductInput>
): Promise<CompleteProduct | null> {
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
            UPDATE products
            SET ${fields.join(', ')}
            WHERE id = $${idx}
            RETURNING *;
        `,
        values,
    })

    return response.rows[0] || null
}

async function remove(id: number): Promise<boolean> {
    const response = await database.query({
        text: `
            DELETE FROM products
            WHERE id = $1
            RETURNING id;
        `,
        values: [id],
    })

    return (response.rowCount ?? 0) > 0
}

const product = {
    create,
    list,
    update,
    remove,
}

export default product
