import {
    IncomingMessage
} from 'node:http'

/**
 * @param {IncomingMessage} req
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

export {
    getJSONBody
}


