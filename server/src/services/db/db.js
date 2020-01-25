import { Client } from 'pg'
import { config } from '../../../config'
import { chalk } from '../../services/chalk'

const dbParams = {
  connectionString: config.databaseUrl,
}

export const db = new Client(dbParams)

export const connect = () =>
  new Promise((resolve) => {
    chalk.success(`Connected to database at ${dbParams.connectionString}`)
    db.connect(resolve)
  })
