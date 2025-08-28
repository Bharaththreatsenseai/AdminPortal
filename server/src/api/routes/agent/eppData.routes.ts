import express from 'express';
import { endPoint }  from '../../controllers/agent/endPoint.ts'; 

const router = express.Router();
router.get('/endPoint', endPoint);

export default router;