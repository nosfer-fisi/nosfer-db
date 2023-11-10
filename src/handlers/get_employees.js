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

  dbClient.connect((err) => {
    dieWithBody(res, `db connection failed: ${err}`, 500)
  }).then(() => {
    getJSONBody(req).then((jsonRes) => {
      dbAddEntry(dbClient, "Employee", jsonRes).then((finalRes) => {
        const rows = finalRes.rows
        dbClient.end()
        memoryCache.set('employees', rows)
        answerAndClose(res, JSON.stringify(rows), 200)
      })
    })
  })

  return
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {URL} url
 */
const getEmployees = (_, res, url) => {
  const dbClient = genNewClient()
  const memoryCache = require('../db/cache')
  const cachedRows = memoryCache.get('employees')
  const params = paramsToObject(url.searchParams)

  if (cachedRows === undefined) {
    dbClient.connect(console.err).then(() => {
      dbRetrieve(dbClient, 'Employee', paramsToObject(url.searchParams)).then((response) => {
        dbClient.end()
        const returnable = response.rows
        answerAndClose(res, JSON.stringify(returnable), 200)
        memoryCache.set('employees', response.rows)
        return
      })
    })
  } else {
    const returnable = Object.keys(params).length === 0 ? cachedRows : cachedRows.filter((elem) => {
      for (const key in params) {
        if (elem[key] != params[key]) {
          return false
        }
      }
      return true
    })
    answerAndClose(res, JSON.stringify(returnable), 200)
  }

  return
}

export {
  getEmployees,
  regEmployees
}



