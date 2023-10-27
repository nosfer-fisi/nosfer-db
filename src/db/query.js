import { genNewClient } from './init.js'
const build = require('sql-bricks')

/**
 * @param {object} columns
 * @param {string} table
 */
const queryEmployees = async (table, columns) => {
    const newClient = genNewClient()
    newClient.connect()

    const queryParams = build.select().from(table).where(columns).toParams()

    newClient.end()
    return await newClient.query(queryParams)
}

queryEmployees({
    id: 19
})

