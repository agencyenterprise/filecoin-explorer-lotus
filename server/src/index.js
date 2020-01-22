import { app } from './app'
import { connect } from './services/db'
import { chalk } from './services/chalk'

const port = process.env.PORT || 8888
const host = process.env.HOST || 'localhost'

const startServer = () => {
  app.listen(+port, host, () => {
    chalk.success(`Server started at [ http://${host}:${port} ]`)
    chalk.success(`Environment ${process.pid}: ${process.env.NODE_ENV}`)
  })
}

;(async () => {
  chalk.pending('Connecting to database...')

  await connect()

  chalk.pending('Starting server...')
  startServer()
})()
