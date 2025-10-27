import { Client } from 'pg'
import type { QueryConfig, QueryResult } from 'pg'

async function query(queryObject: QueryConfig): Promise<QueryResult> {
    let client
    try {
        client = await getNewClient()
        const result = await client.query(queryObject)
        return result
    } finally {
        await client?.end()
    }
}

async function getNewClient() {
    console.log(
        process.env.POSTGRES_PASSWORD,
        typeof process.env.POSTGRES_PASSWORD
    )
    const client = new Client({
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
    })

    await client.connect()
    return client
}

const database = {
    query,
    getNewClient,
}

export default database
