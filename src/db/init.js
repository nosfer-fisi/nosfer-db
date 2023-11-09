import pg from 'pg'

/**
 * @returns {pg.Client}
 */
const genNewClient = () => {
    return new pg.Client({
        user:     process.env.USER,
        password: process.env.PASSWORD,
        host:     process.env.DB_HOST,
        database: process.env.DATABASE,
    })
}

export {
    genNewClient
}

