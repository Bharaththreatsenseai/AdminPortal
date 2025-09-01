import express from 'express';
import { organizationScore } from '../../../controllers/frontend/dashboard/organizationScore.ts';
const router = express.Router();

router.post('/dashboard/organizationscore',organizationScore);


export default router