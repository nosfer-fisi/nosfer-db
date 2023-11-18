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

import {
  IncomingMessage,
  ServerResponse
} from 'http'

import * as yup from 'yup'

const AccountSchema = yup.object({
  username: yup.string().required(),
  hash: yup.string().required(),
  employee_id: yup.string().required(),
  salt: yup.string().required(),
})

const regNewAccount = async (req: IncomingMessage, res: ServerResponse, _: URL) => {
  const body = await getJSONBody(req)
  const bodyAccount = await AccountSchema.validate(body).catch((err) => {
    dieWithBody(res, err.errors, 400)
    return
  })

  const dbClient = genNewClient()
  await dbClient.connect()
  const entry = await dbAddEntry(dbClient, 'Account', bodyAccount)
  await updateCacheTable(dbClient, 'Account')
  dbClient.end()
  answerAndClose(res, JSON.stringify(entry.rows), 200)
  return
}

const verifyAccount = async (req: IncomingMessage, res: ServerResponse, _: URL) => {
  const dbClient = genNewClient()
  const memoryCache = require('../db/cache')
  const cachedRows: any[] = memoryCache.get('Account')
  const body = await getJSONBody(req)

  if (cachedRows === undefined) {
    await dbClient.connect()
    await updateCacheTable(dbClient, 'Account')
  }

  const found = false
  cachedRows.forEach(async (obj) => {
    if (obj.username == body.username) {
      const ver = await verifyPassword(body.password, obj.salt)
      if (!ver) {
        dieWithBody(res, "incorrect password", 200)
        answerAndClose(res, JSON.stringify(obj), 200)
        return
      }
    }
  })

  if (!found) {
    dieWithBody(res, "user not found", 404)
    return
  }

  dbClient.end()
  return
}


export {
  verifyAccount,
  regNewAccount
}



