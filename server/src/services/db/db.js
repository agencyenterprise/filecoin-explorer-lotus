import { Client } from 'pg'
import { config } from '../../../config'
import { chalk } from '../../services/chalk'

let finalUrl = config.databaseUrl

if (!finalUrl.includes('sslmode')) {
  finalUrl = `${finalUrl}?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory`
}

const dbParams = {
  connectionString: finalUrl,
}

export const db = new Client(dbParams)

export const connect = () =>
  new Promise((resolve, reject) => {
    db.connect((error) => {
      if (error) {
        chalk.error(`Error connecting to the database ${error}`, error)

        return reject(error)
      }

      chalk.success(`Connected to database at ${dbParams.connectionString}`)
      resolve()
    })
  })
