import express from 'express';
import { userLog } from '../../controllers/agent/getLog.ts';

const router = express.Router();

router.post('/log',userLog);

export default router