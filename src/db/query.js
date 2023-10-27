import {
    Client
} from 'pg'

const build = require('sql-bricks')

/**
 * @param {Client} client
 * @param {object} columns
 * @param {string} table
 */
const dbQuery = async (client, table, columns) => {
    const queryParams = build.select()
        .from(table)
        .where(columns).toParams()

    return await client.query(queryParams)
}

export {
    dbQuery
}

