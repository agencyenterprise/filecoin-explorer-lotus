import errorMiddleware from 'error-middleware'
import { NotFoundError } from 'error-middleware/errors'
import express from 'express'
import { blocks } from './blocks'
import { chain } from './chain'

const router = express.Router()

router.use('/blocks', blocks)
router.use('/chain', chain)

router.use('*', () => {
  throw new NotFoundError()
})

router.use(errorMiddleware)

export const routes = router
