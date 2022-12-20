import express from 'express'
import { seedService } from '../data/services'

const router = express.Router()

router.get('/seed', seedService)

export default router