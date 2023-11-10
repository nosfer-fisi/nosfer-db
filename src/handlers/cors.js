import {
    IncomingMessage,
    ServerResponse
} from 'node:http'

/**
 * @param {Array<string>} methods
 * @param {function(IncomingMessage, ServerResponse): void} posteriorHandler
 * @param {URL} url
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
const corsMiddleware = (methods, posteriorHandler, url, req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8")
    res.setHeader("Access-Control-Allow-Methods", methods.toString())
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")

    posteriorHandler(req, res, url)
}

export {
    corsMiddleware
}
