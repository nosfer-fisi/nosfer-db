import {
    IncomingMessage,
    ServerResponse
} from 'node:http'

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
const getEmployees = (req, res) => {
    res.writeHead(200)
    if (req.method === "GET") {
        res.write(JSON.stringify({
            hola: "hola"
        }))
        res.end()
    }
}

export {
    getEmployees
}



