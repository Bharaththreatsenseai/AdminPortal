import express from 'express';
import { dateGraph } from '../../../controllers/frontend/dashboard/dateGraph.ts';
const router = express.Router();

router.post('/dashboard/dategraph',dateGraph);


export default router