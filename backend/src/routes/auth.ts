import express from 'express'
import { authService } from '../data/services'

const router = express.Router()

router.post('/auth/register', authService.register)
router.post('/auth/login', authService.login)
router.get('/auth/user', authService.getUser)

export default router