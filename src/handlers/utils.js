import {
  IncomingMessage, ServerResponse
} from 'node:http'

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
  dieWithBody,
  answerAndClose
}


