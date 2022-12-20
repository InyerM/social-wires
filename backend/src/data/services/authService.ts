import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid'

import { User } from "../entities"
import { jwt, validations } from "../../utils"

type Data = {
  message: string
  user?: User
  token?: string
  ok: boolean
}

export const register = async (req: Request, res: Response<Data>) => {
  try{
    const { username, password, email, fullName } = req.body

    const validEmail = validations.isValidEmail(email)

    if(!validEmail){
      return res.status(400).json({
        message: 'Invalid email',
        ok: false
      })
    }

    const validateUser = await User.findOne({ 
      where: [
        { username },
        { email },
      ] 
    })

    if(validateUser){
      return res.status(400).json({
        message: 'User already exists',
        ok: false
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = User.create({
      id: uuidv4(),
      username,
      password: hashedPassword,
      email,
      fullName
    })

    await user.save()

    const token = jwt.createToken({
      id: (user.id).toString(),
      email: user.email,
      username: user.username
    })

    return res.status(201).json({
      message: 'User created successfully',
      user,
      token,
      ok: true
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating user',
      ok: false
    })
  }
}

export const login = async (req: Request, res: Response<Data>) => {
  try{
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if(!user){
      return res.status(404).json({
        message: 'User not found',
        ok: false
      })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword){
      return res.status(401).json({
        message: 'Invalid password',
        ok: false
      })
    }

    const token = jwt.createToken({
      id: (user.id).toString(),
      email: user.email,
      username: user.username
    })

    res.status(200).json({
      message: 'User authenticated successfully',
      token,
      ok: true
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error authenticating user',
      ok: false
    })
  }
}

export const getUser = async (req: Request, res: Response<Data>) => {
  try {
    const { userId } = req.body

    if(!userId){
      return res.status(400).json({
        message: 'Invalid user id',
        ok: false
      })
    }
    
    const user = await User.findOne({ where: { id: userId } })
    if(!user){
      return res.status(404).json({
        message: 'User not found',
        ok: false
      })
    }

    res.status(200).json({
      message: 'User found successfully',
      user,
      ok: true
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error finding user',
      ok: false
    })
  }
}