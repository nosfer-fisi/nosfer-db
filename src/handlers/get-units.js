
import {
    IncomingMessage,
    ServerResponse
} from 'node:http'

import {
    dbQuery
} from '../db/query.js'

import {
    genNewClient
} from '../db/init.js'

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {URL} url
 */

const getUnits = (req, res, url) => {
    const dbClient = genNewClient();

    if (req.method == "GET") {
        dbClient.connect(console.err).then(() => {
            dbQuery(dbClient, "Unit", url.searchParams).then((response) => {
                dbClient.end()
                res.write(JSON.stringify(response.rows))
                res.writeHead(200)
                res.end()
                return
            })
        })
    } else {
        res.writeHead(405)
        res.end()
        return
    }
}

export { getUnits }
