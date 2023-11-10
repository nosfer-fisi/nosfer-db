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

import {
  getJSONBody,
  paramsToObject,
  dieWithBody,
  answerAndClose
} from './utils.js'

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
          dbClient.end()
          memoryCache.set('employees', finalRes.rows)
          res.write(JSON.stringify(finalRes.rows))
          res.writeHead(200)
          res.end()
        })
      })
    })
  } else {
    dieWithBody(res, "method not allowed", 405)
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
  const memoryCache = require('../db/cache')
  const cachedRows = memoryCache.get('employees')
  const params = paramsToObject(url.searchParams)
  let returnable = {}

  if (req.method !== "GET") {
    dieWithBody(res, "method not allowed", 405)
    return
  }

  if (cachedRows === undefined) {
    dbClient.connect(console.err).then(() => {
      dbRetrieve(dbClient, 'Employee', paramsToObject(url.searchParams)).then((response) => {
        dbClient.end()
        returnable = response.rows
        memoryCache.set('employees', response.rows)
        return
      })
    })
  } else {
    returnable = Object.keys(params).length === 0 ? cachedRows : cachedRows.filter((elem) => {
      for (const key in params) {
        if (elem[key] != params[key]) {
          return false
        }
      }
      return true
    })
  }

  answerAndClose(res, JSON.stringify(returnable), 200)
  return
}

export {
  getEmployees,
  regEmployees
}



