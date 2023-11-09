import {
  IncomingMessage
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

export {
  getJSONBody,
  paramsToObject
}


