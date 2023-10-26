import pg from 'pg'

const db = new pg.Client({
    user:     "bauer",
    password: "lol",
    host:     "24.199.90.161",
    database:   "nosfer_db",
})

/**
 * @param {pg.Client} client
 */
const newQuery = async (client) => {
    return client.query(`SELECT * FROM "Employee";`)
}

console.log(db.connect((err) => {
    console.error(err)
}))


db.on('error', (err) => {
  console.error('something bad has happened!', err.stack)
})

newQuery(db).then((res) => {
    console.log(res); db.end()
})

