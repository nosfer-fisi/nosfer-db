import {
  answerAndClose,
  dieWithBody,
  getJSONBody,
  updateCacheTable
} from '../handlers/utils'

import {
  verifyPassword,
  hashPassword
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
  password: yup.string().required(),
  documento_empleado: yup.string().required(),
})

const regNewAccount = async (req: IncomingMessage, res: ServerResponse, _: URL) => {
  const dbClient = genNewClient()
  await dbClient.connect()

  const body = await getJSONBody(req)
  const bodyAccount = await AccountSchema.validate(body).catch((err) => {
    dieWithBody(res, err.errors, 400)
    return
  })

  if (!bodyAccount) {
    dieWithBody(res, "invalid payload", 400)
    return
  }

  const hash = await hashPassword(bodyAccount.password, "abc")
  if (hash === undefined) {
    dieWithBody(res, "internal storing error", 500)
    return
  }

  const memoryCache = require('../db/cache')
  let employees = await memoryCache.get('Employee')
  if (employees === undefined) {
    employees = await updateCacheTable(dbClient, 'Employee')
  }

  const referencedEmployee = employees.find(employee => bodyAccount.documento_empleado === employee.document)
  if (referencedEmployee === undefined) {
    dieWithBody(res, "account or password invalid", 404)
    return
  }

  const entry = await dbAddEntry(dbClient, 'Account', {
    username: bodyAccount.username,
    employee_id: referencedEmployee.id,
    hash: hash,
    salt: "abc"
  })
  await updateCacheTable(dbClient, 'Account')
  dbClient.end()
  answerAndClose(res, JSON.stringify(entry.rows), 200)
  return
}

const AccountVerifySchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
})

const verifyAccount = async (req: IncomingMessage, res: ServerResponse, _: URL) => {
  const dbClient = genNewClient()
  await dbClient.connect()

  const memoryCache = require('../db/cache')
  const body = await getJSONBody(req)

  const parsedPayload = await AccountVerifySchema.validate(body).catch((err) => {
    dieWithBody(res, err, 500)
  })

  if (!parsedPayload) {
    dieWithBody(res, "invalid payload", 400)
    return
  }

  let cachedRows: any[] = memoryCache.get('Account')
  if (cachedRows === undefined) {
    cachedRows = await updateCacheTable(dbClient, 'Account')
  }

  const account = cachedRows.find(obj => obj.username === parsedPayload.username)
  const verify = await verifyPassword(parsedPayload.password, account.salt, account.hash)

  if (account === undefined) {
    dieWithBody(res, "invalid password or username", 400)
    return
  }

  if (verify) {
    answerAndClose(res, JSON.stringify(account), 200)
  } else {
    dieWithBody(res, "invalid password or username", 400)
  }

  dbClient.end()
  return
}


export {
  verifyAccount,
  regNewAccount
}



