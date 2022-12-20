import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { authRouter, messagesRouter, seedRouter } from './routes'
import { jwt } from './utils'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(jwt.validateJWT)

// Routes
app.use('/api', authRouter)
app.use('/api', messagesRouter)
app.use('/api', seedRouter)

export default app