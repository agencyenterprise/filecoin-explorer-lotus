import express from 'express'
import asyncHandler from 'express-async-handler'
import { getChain } from './getChain'
import { getGraph } from './getGraph'

const router = express.Router()

router.get('', asyncHandler(getChain))
router.get('/graph.json', asyncHandler(getGraph))

export const chain = router
