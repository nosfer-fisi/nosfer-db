import {
  IncomingMessage,
  ServerResponse
} from 'node:http'

import {
  dbRetrieve
} from '../db/query'

import {
  genNewClient
} from '../db/init'

/**
 * @param {IncomingMessage} req
 * @returns {Promise<Object>}
 */
const getJSONBody = async (req) => {
  let bodyChunks = ""
  return new Promise((resolve, reject) => {
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


/**
 * @param {string} tableName
 * @returns {Promise<any[]>}
 */
const updateCacheTable = async (tableName) => {
  const memoryCache = require('../db/cache')
  const dbClient = genNewClient()
  dbClient.connect(console.err)

  const newMemory = await dbRetrieve(dbClient, tableName, {})
  const rows = newMemory.rows
  memoryCache.set(tableName, rows)

  dbClient.end()
  return rows
}

/**
 * @param {URLSearchParams} params
 * @returns {Object}
 */
const paramsToObject = (params) => {
  const res = {}
  for (const [key, value] of params) {
    res[key] = value
  }

  return res
}


/**
 * @param {ServerResponse} res
 * @param {string} message
 * @param {number} code
 */
const dieWithBody = (res, message, code) => {
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

/**
 * @param {ServerResponse} res
 * @param {string} message
 * @param {number} code
 */
const answerAndClose = (res, message, code) => {
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


