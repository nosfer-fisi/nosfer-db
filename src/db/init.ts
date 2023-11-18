import {
  Client
} from 'pg'

const genNewClient = () => {
  return new Client({
    user:     process.env.USER,
    password: process.env.PASSWORD,
    host:     process.env.DB_HOST,
    database: process.env.DATABASE,
  })
}

export {
  genNewClient
}

