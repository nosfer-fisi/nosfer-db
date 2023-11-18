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
  
  import type {
    DiseaseType
  } from '../internal/types'
  
  
  const regDiseases = async (req: IncomingMessage, res: ServerResponse, _: URL) => {
    const body = await getJSONBody(req)
  
    const dbClient = genNewClient()
    await dbClient.connect()
  
    dbAddEntry(dbClient, "Disease", body).then((finalRes) => {
      dbClient.end()
      const rows: DiseaseType[] = finalRes.rows
      answerAndClose(res, JSON.stringify(rows), 200)
    })
  
    await updateCacheTable(dbClient, 'Employee')
    return
  }
  
  const getDiseases = async (_: IncomingMessage, res: ServerResponse, url: URL) => {
    const params = paramsToObject(url.searchParams)
    const memoryCache = require('../db/cache')
    const dbClient = genNewClient()
    let cachedRows: DiseaseType[] = memoryCache.get('Employee')
  
    if (cachedRows === undefined) {
      await dbClient.connect()
      cachedRows  = await updateCacheTable(dbClient, 'Employee')
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
    getDiseases,
    regDiseases
  }
  