import express from 'express'
import { userRegistration} from "../../controllers/agent/registration.ts";


const router =  express.Router()

router.post('/registration',userRegistration)

export default router