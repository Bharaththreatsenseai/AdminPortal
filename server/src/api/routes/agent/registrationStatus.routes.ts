import express from 'express'
import { registrationStatus } from '../../controllers/agent/registrationStatus.ts'


const router =  express.Router()

router.post('/registration/status',registrationStatus)

export default router