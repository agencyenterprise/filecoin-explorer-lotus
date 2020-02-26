import express from 'express'
import asyncHandler from 'express-async-handler'
import { getBlockHeight } from './getBlockHeight'
import { getBlockRange } from './getBlockRange'
import { showBlock } from './showBlock'

const router = express.Router()

router.get('/range', asyncHandler(getBlockRange))
router.get('/height/:id', asyncHandler(getBlockHeight))
router.get('/:id', asyncHandler(showBlock))

export const blocks = router
