import express from 'express'
import path from 'path'
import { app } from './server/src/app'
import { connect } from './server/src/services/db'
import { config } from './server/config'

app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'), (err) => {
    if (err) {
      res.status(500).send(err)
    }
  })
})
;(async () => {
  console.log('Connecting to database...')

  await connect()

  console.log('Starting server...')
  app.listen(+config.port, config.host, () => {
    console.log(`Server started at [ http://${config.host}:${config.port} ]`)
  })
})()
