import express from 'express';
import asyncHandler from 'express-async-handler';
import { showBlock } from './showBlock';
import { getBlockRange } from './getBlockRange';

const router = express.Router();

router.get('/range', asyncHandler(getBlockRange))
router.get('/:id', asyncHandler(showBlock))

export const blocks = router
