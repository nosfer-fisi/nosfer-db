import {
    IncomingMessage,
    ServerResponse
} from 'node:http'

import {
    dbAddEntry,
    dbRetrieve
} from '../db/query.js'

import {
    genNewClient
} from '../db/init.js'
import {getJSONBody} from './utils.js'

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {URL} url
 */
const regEmployees = (req, res, _) => {
    const dbClient = genNewClient()

    if (req.method === "POST") {
        dbClient.connect(console.err).then(() => {
            getJSONBody(req).then((jsonRes) => {
                dbAddEntry(dbClient, "Employee", jsonRes).then((finalRes) => {
                    res.write(JSON.stringify(finalRes.rows))
                    res.writeHead(200)
                    res.end()
                })
            })
        })
    } else {
        res.writeHead(405)
        res.end()
        return
    }
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {URL} url
 */
const getEmployees = (req, res, url) => {
    const dbClient = genNewClient()

    if (req.method === "GET") {
        dbClient.connect(console.err).then(() => {
            dbRetrieve(dbClient, "Employee", url.searchParams).then((response) => {
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

export {
    getEmployees,
    regEmployees
}



