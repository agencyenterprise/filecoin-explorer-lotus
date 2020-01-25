import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import nocache from 'nocache'
import { config } from '../config'
import { routes } from './routes'
import { initializeRequestLogger } from './services/logger'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(nocache())

if (config.env !== 'test') {
  initializeRequestLogger(app)
}

app.use('/api', routes)

export { app }
