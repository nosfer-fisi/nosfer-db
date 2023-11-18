import {
  IncomingMessage,
  ServerResponse
} from 'node:http'

import { Client } from 'pg'

import {
  dbRetrieve
} from '../db/query'

const getJSONBody = async (req: IncomingMessage) => {
  let bodyChunks = ""
  return new Promise<any>((resolve, reject) => {
    req.on("data", (data) => {
      bodyChunks += data
    })

    req.once("end", () => {
      try {
        let returnable = JSON.parse(bodyChunks)
        resolve(returnable)
      } catch (error) {
        reject(error)
      }
    })
  })

}

const updateCacheTable = async (dbClient: Client, tableName: string) => {
  const memoryCache = require('../db/cache')

  const newMemory = await dbRetrieve(dbClient, tableName, {})
  const rows: any[] = newMemory.rows
  memoryCache.set(tableName, rows)
  return rows
}

const paramsToObject = (params: URLSearchParams) => {
  const res: any = {}
  for (const [key, value] of params) {
    res[key] = value
  }

  return res
}

const dieWithBody = (res: ServerResponse, message: string | string[], code: number) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Access-Control-Allow-Methods", "ANY")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "*")

  res.write(JSON.stringify({
    errorCode: code,
    message: message,
  }))

  res.writeHead(code)
  res.end()
}

const answerAndClose = (res: ServerResponse, message: string, code: number) => {
  res.write(message)
  res.writeHead(code)
  res.end()
}

export {
  getJSONBody,
  paramsToObject,
  updateCacheTable,
  dieWithBody,
  answerAndClose
}


