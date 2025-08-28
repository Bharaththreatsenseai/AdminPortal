import express from 'express';
import { allLogsDownload } from '../../controllers/download/allLogsDownload.ts';

const router = express.Router();
router.post('/allLogs', allLogsDownload);

export default router;