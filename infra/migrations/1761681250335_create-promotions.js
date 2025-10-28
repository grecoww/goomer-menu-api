export const up = (pgm) => {
    pgm.createType('week_day', [
        'domingo',
        'segunda',
        'terca',
        'quarta',
        'quinta',
        'sexta',
        'sabado',
    ])

    pgm.createTable('promotions', {
        id: {
            type: 'serial',
            primaryKey: true,
        },

        product_id: {
            type: 'integer',
            notNull: true,
            references: 'products(id)',
            onDelete: 'CASCADE',
        },

        description: {
            type: 'varchar(255)',
            notNull: true,
        },

        promotional_price_cents: {
            type: 'integer',
            notNull: true,
            check: 'promotional_price_cents >= 0',
        },

        days_of_week: {
            type: 'week_day[]',
            notNull: true,
        },

        start_time: {
            type: 'time(0)',
            notNull: true,
            check: "start_time = date_trunc('minute', start_time) AND EXTRACT(MINUTE FROM start_time) % 15 = 0",
        },

        end_time: {
            type: 'time(0)',
            notNull: true,
            check: "end_time = date_trunc('minute', end_time) AND EXTRACT(MINUTE FROM end_time) % 15 = 0",
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
