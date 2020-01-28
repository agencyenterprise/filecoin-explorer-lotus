import { Client } from 'pg'
import { config } from '../../../config'
import { chalk } from '../../services/chalk'

const dbParams = {
  connectionString: config.databaseUrl,
}

if ((config.env && config.env !== 'development') || config.databaseSSL === 'true') {
  dbParams.ssl = true
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
