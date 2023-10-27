import pg from 'pg'

// returns a new pg.Client object
const genNewClient = () => {
    return new pg.Client({
        user:     process.env.USER,
        password: process.env.PASSWORD,
        host:     process.env.HOST,
        database: process.env.DATABASE,
    })
}

export {
    genNewClient
}

