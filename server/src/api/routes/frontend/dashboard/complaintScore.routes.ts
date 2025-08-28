import express from 'express';
import { complaintScore } from '../../../controllers/frontend/dashboard/complainScore.ts';
const router = express.Router();

router.post('/dashboard/complaintscore',complaintScore);


export default router