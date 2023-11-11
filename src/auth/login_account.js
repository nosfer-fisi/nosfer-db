import {
  answerAndClose,
  dieWithBody,
  getJSONBody,
  updateCacheTable
} from '../handlers/utils'

import {
  verifyPassword
} from '../auth/hash'

import {
  genNewClient
} from '../db/init'

import {
  dbAddEntry
} from '../db/query'


/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {URL} url
 */
const regNewAccount = async (req, res, _) => {
  const dbClient = genNewClient()
  const body = await getJSONBody(req)

  if (body.employee_id === undefined) {
    dieWithBody(res, "uncomplete columns", 400)
  }

  dbAddEntry(dbClient, 'Account', body)
  updateCacheTable(dbClient, 'Account')
  dbClient.end()
  return
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {URL} url
 */
const verifyAccount = async (req, res, _) => {
  const dbClient = genNewClient()
  const memoryCache = require('../db/cache')
  const cachedRows = memoryCache.get('accounts')
  const body = await getJSONBody(req)

  if (cachedRows === undefined) {
    updateCacheTable(dbClient, 'Account')
  }

  const found = false
  for (const obj in cachedRows) {
    if (obj.username == body.username) {
      const ver = await verifyPassword(body.password, obj.salt)
      if (!ver) {
        dieWithBody(res, "incorrect password", 200)
        answerAndClose(res, JSON.stringify(obj), 200)
        return
      }
    }
  }

  if (!found) {
    dieWithBody(res, "user not found", 404)
  }

  dbClient.end()
  return
}


export {
  verifyAccount,
  regNewAccount
}



