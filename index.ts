import express from 'express'
import path from 'path'
import { app } from './server/src/app'
import { connect } from './server/src/services/db'

app.use(express.static(path.join(__dirname, '../client/build')))

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'), (err) => {
    if (err) {
      res.status(500).send(err)
    }
  })
})

const port = process.env.PORT || 8888
const host = process.env.HOST || 'localhost'
;(async () => {
  console.log('Connecting to database...')

  await connect()

  console.log('Starting server...')
  app.listen(+port, host, () => {
    console.log(`Server started at [ http://${host}:${port} ]`)
  })
})()
