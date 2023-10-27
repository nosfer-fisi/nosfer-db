import pg from 'pg'


// returns a new pg.Client object
const genNewClient = () => {
    return new pg.Client({
        user:     "bauer",
        password: "lol",
        host:     "24.199.90.161",
        database: "nosfer_db",
    })
}

export {
    genNewClient
}

