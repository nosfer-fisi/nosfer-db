import type {
  Client,
  QueryResult
} from 'pg'

const build = require('sql-bricks-postgres')

const dbRetrieve = async (client: Client, table: string, columns: any): Promise<QueryResult<any>> => {
  const queryParams = build.select()
    .from(table)
    .where(columns).toParams()

  return await client.query(queryParams)
}

/**
 * returns the same row that was registered for its posterior processing
 */
const dbAddEntry= async (client: Client, table: string, columns: any): Promise<QueryResult<any>> => {
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

