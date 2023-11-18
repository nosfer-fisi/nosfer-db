import * as http from 'http'

import {
  corsMiddleware,
} from './handlers/cors.js'

import {
  dieWithBody
} from './handlers/utils.js'

import {
  getEmployees,
  regEmployees,
  //getDiseases,
  //getDonations,
  //getLaboratories,
  //getMedicalExams,
  //getPersons,
  //getQualityControls,
  //getRequests,
  //getStorages,
  //getUnits
} from './handlers'

import {
  regNewAccount,
  verifyAccount
} from './auth/login_account.js'

type handleFunc = (req: http.IncomingMessage, res: http.ServerResponse, url: URL) => Promise<void>

interface EndpointHandlerMux {
  [key: string]: {
    handle: handleFunc,
    method: string,
  }
}

const RouterMux: EndpointHandlerMux = {
  "/api/employees/get": {
    handle: getEmployees,
    method: "GET",
  },
  "/api/employees/add": {
    handle: regEmployees,
    method: "POST",
  },
  "/api/account/verify": {
    handle: verifyAccount,
    method: "POST",
  },
  "/api/account/register": {
    handle: regNewAccount,
    method: "POST",
  }
  /*
  "/api/diseases/get": {
    handle: getDiseases,
    method: "GET",
  },
  "/api/donations/get": {
    handle: getDonations,
    method: "GET",
  },
  "/api/laboratories/get": {
    handle: getLaboratories,
    method: "GET",
  },
  "/api/medical-exams/get": {
    handle: getMedicalExams,
    method: "GET",
  },
  "/api/persons/get": {
    handle: getPersons,
    method: "GET",
  },
  "/api/quality-controls/get": {
    handle: getQualityControls,
    method: "GET",
  },
  "/api/requests/get": {
    handle: getRequests,
    method: "GET",
  },
  "/api/storages/get": {
    handle: getStorages,
    method: "GET",
  },
  "/api/units/get": {
    handle: getUnits,
    method: "GET",
  },
  */
}

/**
 * This consumes the router map to handle all requests
 */
const mainRequestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (req.url == undefined) {
    dieWithBody(res, "invalid request", 500)
    return
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host}`)

  if (RouterMux[reqUrl.pathname] === undefined) {
    dieWithBody(res, "endpoint not valid", 404)
    return
  } else if (RouterMux[reqUrl.pathname].method !== req.method) {
    dieWithBody(res, "method not supported for this endpoint", 405)
    return
  } else {
    corsMiddleware(
      RouterMux[reqUrl.pathname].method,
      RouterMux[reqUrl.pathname].handle,
      reqUrl,
      req,
      res,
    )
    return
  }
}

const server = http.createServer(mainRequestHandler)
server.listen(process.env.PORT)
server.on('listening',function(){
  console.log(`server running @ ${process.env.PORT}`);
});



