import express from 'express';
import { activityGraph } from '../../../controllers/frontend/dashboard/activityGraph.ts';
const router = express.Router();

router.post('/dashboard/activitygraph',activityGraph);


export default router