import errorMiddleware from 'error-middleware'
import express from 'express'
import { blocks } from './blocks'
import { chain } from './chain'

const router = express.Router()

router.get('/', (req, res) => res.sendStatus(418))

router.use('/blocks', blocks)
router.use('/chain', chain)

router.use(errorMiddleware)

export const routes = router
