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

    if (reqUrl.pathname == "/api/diseases/get") {
        corsMiddleware("GET", getDiseases, reqUrl, req, res)
    } else if (reqUrl.pathname == "/api/employees/get") {
        corsMiddleware("GET", getEmployees, reqUrl, req, res)
    } else if (reqUrl.pathname === "/api/employees/add") {
        corsMiddleware("POST", regEmployees, reqUrl, req, res)
    } else if (reqUrl.pathname == "/api/donations/get") {
        corsMiddleware("GET", getDonations, reqUrl, req, res)
    } else if (reqUrl.pathname == "/api/laboratories/get") {
        corsMiddleware("GET", getLaboratories, reqUrl, req, res)
    } else if (reqUrl.pathname == "/api/medical-exams/get") {
        corsMiddleware("GET", getMedicalExams, reqUrl, req, res)
    } else if (reqUrl.pathname == "/api/persons/get") {
        corsMiddleware("GET", getPersons, reqUrl, req, res)
    } else if (reqUrl.pathname == "/api/quality-controls/get") {
        corsMiddleware("GET", getQualityControls, reqUrl, req, res)
    } else if (reqUrl.pathname == "/api/requests/get") {
        corsMiddleware("GET", getRequests, reqUrl, req, res)
    } else if (reqUrl.pathname == "/api/storages/get") {
        corsMiddleware("GET", getStorages, reqUrl, req, res)
    } else if (reqUrl.pathname == "/api/units/get") {
        corsMiddleware("GET", getUnits, reqUrl, req, res)
    } else {
        res.writeHead(404)
        res.end()
        return
    }

}

const server = http.createServer(mainRequestHandler)
server.listen(process.env.PORT, process.env.DB_HOST, () => {
    console.log(`Server running @ ${process.env.PORT}`)
})


