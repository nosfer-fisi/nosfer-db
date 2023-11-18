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
    updateCacheTable,
    dieWithBody,
  } from './utils.js'
  
  import {
    unitSchema,
  } from '../internal/types'
  
  
  const regUnits = async (req: IncomingMessage, res: ServerResponse, _: URL) => {
    const body = await getJSONBody(req)
  
    const parsedBody = await unitSchema.validate(body).catch((err) => {
      dieWithBody(res, err.errors, 400)
      return
    })
  
    if (!parsedBody) {
      dieWithBody(res, "invalid payload", 400)
      return
    }
  
    const dbClient = genNewClient()
    await dbClient.connect()
  
    const newEntry = await dbAddEntry(dbClient, "Unit", parsedBody)
    const rows = newEntry.rows
    await updateCacheTable(dbClient, 'Unit')
  
    dbClient.end()
    answerAndClose(res, JSON.stringify(rows), 200)
    return
  }
  
  const getUnits = async (_: IncomingMessage, res: ServerResponse, url: URL) => {
    const params = paramsToObject(url.searchParams)
    const memoryCache = require('../db/cache')
    const dbClient = genNewClient()
    let cachedRows = memoryCache.get('Unit')
  
    if (cachedRows === undefined) {
      await dbClient.connect()
      cachedRows  = await updateCacheTable(dbClient, 'Unit')
      dbClient.end()
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
    getUnits,
    regUnits
  }