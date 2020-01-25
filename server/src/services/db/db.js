import { Client } from 'pg'
import { config } from '../../../config'
import { chalk } from '../../services/chalk'

let finalUrl = config.databaseUrl

if (!finalUrl.includes('sslmode')) {
  finalUrl = `${finalUrl}?sslmode=require`
}

const dbParams = {
  connectionString: finalUrl,
}

export const db = new Client(dbParams)

export const connect = () =>
  new Promise((resolve, reject) => {
    db.connect((error) => {
      if (error) {
        chalk.error(`error connecting to the database ${error}`, error)
        reject(error)
      }

      chalk.success(`Connected to database at ${dbParams.connectionString}`)
      resolve()
    })
  })
