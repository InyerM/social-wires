import { Request, Response } from "express"
import { Message, User } from "../entities"
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

interface ISeedUser {
  id?: string
  username: string
  fullName: string
  password: string
  email: string
}

interface ISeedMessage {
  text: string
  title: string
  userId?: string
}


interface ISeedData {
  users: ISeedUser[]
  messages: ISeedMessage[]
}

const seedData: ISeedData = {
  users: [
    {
      id: uuidv4(),
      username: 'admin',
      fullName: 'Admin',
      password: bcrypt.hashSync('admin', 12),
      email: 'admin@google.com',
    },
    {
      id: uuidv4(),
      username: 'user',
      fullName: 'User',
      password: bcrypt.hashSync('user', 12),
      email: 'user@google.com',
    },
  ],
  messages: [
    {
      text: 'Hello world',
      title: 'Hello',
    },
    {
      text: 'Hello from typescript',
      title: 'Hello',
    },
    {
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
      title: 'Lorem',
    },
    {
      text: 'Libero, quia. Quisquam, quod.',
      title: 'Libero',
    }
  ]
}

export const seedService = async (req: Request, res: Response) => {
  try {
    const { users, messages } = seedData

    await Promise.all(users.map(async (user) => {
      const newUser = User.create({
        ...user,
      })
      await newUser.save()
    }))

    messages.forEach(async (message) => {
      // random between 0 and 1
      const random = Math.round(Math.random())

      const newMessage = Message.create({
        ...message,
        user: users[random].id as unknown as User
      })
      console.log("🚀 ~ file: seedService.ts:82 ~ messages.forEach ~ newMessage", newMessage)
      await newMessage.save()
    })

    return res.status(201).json({
      message: 'Database seeded successfully'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Something went wrong'
    })
  }
}