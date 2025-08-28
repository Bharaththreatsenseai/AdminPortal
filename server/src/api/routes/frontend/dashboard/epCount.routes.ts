import express from 'express';
import { userCount } from '../../../controllers/frontend/userCount.ts';
const router = express.Router();

router.post('/dashboard/usercount',userCount);


export default router