import database from '../../infra/database'

async function view() {
    const response = await database.query(`
      SELECT
    p.id,
    p.name,
    p.price_cents,
    p.category,
    p.visibility,
    CASE
        WHEN pr.id IS NOT NULL THEN json_build_object(
            'id', pr.id,
            'description', pr.description,
            'promotional_price_cents', pr.promotional_price_cents,
            'days_of_week', array_to_json(pr.days_of_week),
            'start_time', pr.start_time,
            'end_time', pr.end_time
        )
        ELSE NULL
    END AS promotion
FROM products p
LEFT JOIN promotions pr
    ON pr.product_id = p.id
    AND pr.days_of_week && ARRAY[
        CASE EXTRACT(DOW FROM NOW() AT TIME ZONE 'America/Sao_Paulo')
            WHEN 0 THEN 'domingo'
            WHEN 1 THEN 'segunda'
            WHEN 2 THEN 'terca'
            WHEN 3 THEN 'quarta'
            WHEN 4 THEN 'quinta'
            WHEN 5 THEN 'sexta'
            WHEN 6 THEN 'sabado'
        END
    ]::week_day[]
    AND (NOW() AT TIME ZONE 'America/Sao_Paulo')::time BETWEEN pr.start_time AND pr.end_time
WHERE p.visibility = TRUE
ORDER BY p.category, p.name;
`)
    return response.rows
}

const menu = {
    view,
}

export default menu
