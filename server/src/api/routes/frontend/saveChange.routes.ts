import express from "express";
import {saveChanges}  from "../../controllers/frontend/saveChanges.ts";

const router =  express.Router()

router.post('/usergroup/roles/update',saveChanges)

export default router