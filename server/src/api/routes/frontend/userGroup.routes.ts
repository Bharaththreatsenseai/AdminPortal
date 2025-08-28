import { userGroupInfo } from "../../controllers/frontend/userGroup.ts";
import express from "express";

const router =  express.Router()

router.post('/usergroup',userGroupInfo)

export default router