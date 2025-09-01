import express from 'express';
import { userCount } from '../../../controllers/frontend/dashboard/epCount.ts';
const router = express.Router();

router.post('/dashboard/usercount',userCount);


export default router