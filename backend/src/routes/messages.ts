import express from 'express'
import { messageService } from '../data/services'

const router = express.Router()

router.post('/messages', messageService.createMessage)
router.get('/messages', messageService.getAllMessages)
router.put('/messages/:id', messageService.updateMessage)
router.delete('/messages/:id', messageService.deleteMessage)
router.get('/my-messages', messageService.getMyMessages)

export default router