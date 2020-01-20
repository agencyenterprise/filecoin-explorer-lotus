import express from 'express';
import asyncHandler from 'express-async-handler';
import { showBlock } from './showBlock';

const router = express.Router();

router.get('/:id', asyncHandler(showBlock))

export const blocks = router
