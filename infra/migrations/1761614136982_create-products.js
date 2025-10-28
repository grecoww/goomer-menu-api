export const up = (pgm) => {
    pgm.createType('product_category', [
        'entradas',
        'pratos_principais',
        'sobremesas',
        'bebidas',
    ])

    pgm.createTable('products', {
        id: {
            type: 'serial',
            primaryKey: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
            unique: true,
        },
        price_cents: {
            type: 'integer',
            notNull: true,
            check: 'price_cents >= 0',
        },
        category: {
            type: 'product_category',
            notNull: true,
        },
        visibility: {
            type: 'boolean',
            notNull: true,
        },
        created_at: {
            type: 'timestamptz',
            default: pgm.func('now()'),
        },
        updated_at: {
            type: 'timestamptz',
            default: pgm.func('now()'),
        },
    })
}

export const down = false
