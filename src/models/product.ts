import database from '../../infra/database'
import type { ProductInput } from '../schemas/products'

async function create(userInputValues: ProductInput) {
    const response = await database.query({
        text: `INSERT INTO 
                products
            (name, price_cents, category, visibility)
                VALUES
            ($1,$2,$3,$4)
                RETURNING
                    *
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

const product = {
    create,
}

export default product
