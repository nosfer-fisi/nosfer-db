import * as http from 'http'

import {
    corsMiddleware,
} from './handlers/cors.js'

import {
    getEmployees
} from './handlers/get_employees.js'

const host = 'localhost'
const port = 8080

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const mainRequestHandler = (req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`)

    if (reqUrl.pathname == "/api/employees/get") {
        corsMiddleware("GET", getEmployees, reqUrl, req, res)
    } else {
        res.writeHead(404)
        res.end()
        return
    }
}

const server = http.createServer(mainRequestHandler)
server.listen(port, host, () => {
    console.log(`Server running @ ${port}`)
})



