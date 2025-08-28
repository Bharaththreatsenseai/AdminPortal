import express from 'express';
import { userLogDownload } from '../../controllers/download/userLogDownload.ts'

const router = express.Router();
router.post('/userLogs', userLogDownload);

export default router;