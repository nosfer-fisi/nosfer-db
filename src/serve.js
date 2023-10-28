import * as http from 'http'

import {
    corsMiddleware,
} from './handlers/cors.js'

import {
    getEmployees,
    regEmployees
} from './handlers/get_employees.js'


/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const mainRequestHandler = (req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host}`)

    if (reqUrl.pathname === "/api/employees/get") {
        corsMiddleware("GET", getEmployees, reqUrl, req, res)
    } else if (reqUrl.pathname === "/api/employees/add") {
        corsMiddleware("POST", regEmployees, reqUrl, req, res)
    } else {
        res.writeHead(404)
        res.end()
        return
    }
}

const server = http.createServer(mainRequestHandler)
server.listen(process.env.PORT, process.env.SERVER_HOST, () => {
    console.log(`Server running @ ${process.env.PORT}`)
})



