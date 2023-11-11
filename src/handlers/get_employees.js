import {
  IncomingMessage,
  ServerResponse
} from 'node:http'

import {
  dbAddEntry,
} from '../db/query.js'

import {
  genNewClient
} from '../db/init.js'

import {
  getJSONBody,
  paramsToObject,
  answerAndClose,
  updateCacheTable
} from './utils.js'

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {URL} url
 */
const regEmployees = async (req, res, _) => {
  const dbClient = genNewClient()
  const body = await getJSONBody(req)

  dbClient.connect(console.err).then(() => {
    dbAddEntry(dbClient, "Employee", body).then((finalRes) => {
      dbClient.end()
      const rows = finalRes.rows
      answerAndClose(res, JSON.stringify(rows), 200)
    })
  })

  updateCacheTable('Employee')
  return
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {URL} url
 */
const getEmployees = async (_, res, url) => {
  const memoryCache = require('../db/cache')
  const params = paramsToObject(url.searchParams)
  let cachedRows = memoryCache.get('Employee')

  if (cachedRows === undefined) {
    cachedRows = await updateCacheTable('Employee')
  }

  if (Object.keys(params).length === 0) {
    answerAndClose(res, JSON.stringify(cachedRows), 200)
    return
  }

   const filteredRows = cachedRows.filter((elem) => {
    for (const key in params) {
      if (elem[key] != params[key]) {
        return false
      }
    }
    return true
  })

  answerAndClose(res, JSON.stringify(filteredRows), 200)
  return
}

export {
  getEmployees,
  regEmployees
}



