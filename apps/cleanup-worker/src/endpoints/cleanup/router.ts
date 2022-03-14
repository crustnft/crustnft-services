import express from 'express';
import asyncHandler from 'express-async-handler';
import { startCleanUp } from './controller';

const router = express.Router();

router.post('/', asyncHandler(startCleanUp));

export default router;
