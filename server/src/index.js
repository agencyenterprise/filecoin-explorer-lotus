import { app } from './app'
import { connect } from './services/db'
import { chalk } from './services/chalk'
import { config } from '../config'
;(async () => {
  chalk.pending('Connecting to database...')

  await connect()

  chalk.pending('Starting server...')

  app.listen(+config.port, config.host, () => {
    chalk.success(`Server started at [ http://${config.host}:${config.port} ]`)
    chalk.success(`Environment ${process.pid}: ${config.env}`)
  })
})()
