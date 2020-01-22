import { Client } from 'pg'
import { chalk } from '../../services/chalk'

const dbParams = {
  connectionString: process.env.DATABASE_URL,
}

export const db = new Client(dbParams)

export const connect = () =>
  new Promise((resolve) => {
    chalk.success(`Connected to database at ${dbParams.connectionString}`)
    db.connect(resolve)
  })
