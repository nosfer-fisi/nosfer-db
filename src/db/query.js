import pg from 'pg'

const build = require('sql-bricks-postgres')

/**
 * @param {pg.Client} client
 * @param {object} columns
 * @param {string} table
 * @returns {Promise<pg.QueryResult<any>>}
 */
const dbRetrieve = async (client, table, columns) => {
  const queryParams = build.select()
    .from(table)
    .where(columns).toParams()

  return await client.query(queryParams)
}

/**
 * returns the same row that was registered
 * for posterior processing
 *
 * @param {pg.Client} client
 * @param {object} columns
 * @param {string} table
 * @returns {Promise<pg.QueryResult<any>>}
 */
const dbAddEntry = async (client, table, columns) => {
  const queryParams = build.insert()
    .into(table)
    .values(columns)
    .returning("*").toParams()

  return await client.query(queryParams)
}

export {
  dbAddEntry,
  dbRetrieve
}

