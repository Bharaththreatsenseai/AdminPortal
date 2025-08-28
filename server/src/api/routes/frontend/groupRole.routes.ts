import express from 'express';
import { groupRolesInfo } from '../../controllers/frontend/groupRole.ts';

const router = express.Router();

router.post('/usergroup/roles',groupRolesInfo);

export default router