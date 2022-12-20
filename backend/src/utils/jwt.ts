import jwt from 'jsonwebtoken'
import { authConfig } from '../config'
import { NextFunction, Request, Response } from 'express'

interface Payload {
  id: string
  email: string
  username: string
}

interface RequestWithUserId extends Request {
  userId?: string
}

export const validateJWT = (req: RequestWithUserId, _res: Response, next: NextFunction) => {
  let token
  let decodedToken

  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
    decodedToken = jwt.verify(token, authConfig.jwt.secret as string) as Payload
  }

  if(token || decodedToken){ 
    const { id } = decodedToken as Payload
    req.body.userId = id
  }

  next()
}

export const createToken = ({ email, id, username }: Payload) => {
  const token = jwt.sign({ email, id, username }, authConfig.jwt.secret as string, {
    expiresIn: authConfig.jwt.expiresIn,
  })
  return token
}