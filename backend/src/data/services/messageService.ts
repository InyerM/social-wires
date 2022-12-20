import { Request, Response } from "express"
import { ILike } from "typeorm"
import { dateFunctions } from "../../utils"

import { Message } from "../entities"

interface ResponseData {
  message: string
  data?: Message[] | Message
  ok?: boolean
}


export const getAllMessages = async (req: Request, res: Response<ResponseData>) => {
  try{
    const { userId } = req.body
    const { search, dateFilter } = req.query

    let where = {}, messages = []

    if(dateFilter && !dateFunctions.validateDate(dateFilter as string)){
      return res.status(400).json({
        message: 'Invalid date format',
        ok: false
      })
    }

    if(search){
      where = [
        { title: ILike(`%${search}%`) },
        { text: ILike(`%${search}%`) },
        { user: { username: ILike(`%${search}%`) } },
        { user: { fullName: ILike(`%${search}%`) } }
      ]
    }
    
    if(!userId){
      return res.status(400).json({
        message: 'Invalid or missing token',
        ok: false
      })
    }

    messages = await Message.find({
      relations: ['user'],
      select: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'user'],
      where,
    })

    if(!messages || messages.length === 0){
      return res.status(404).json({
        message: 'No messages found',
        ok: false
      })
    }

    if(dateFilter){
      messages = messages.filter(message => {
        const messageDate = new Date(message.createdAt)
        return messageDate.getDate() === new Date(dateFilter as string).getDate()
      })
    }

    messages = messages.map(message => {
      const { user, ...rest } = message
      return {
        ...rest,
        user: {
          username: user.username,
          fullName: user.fullName
        }
      }
    })

    return res.status(200).json({
      message: 'Messages found',
      data: messages as Message[],
      ok: true
    })
    
  }catch(err){
    return res.status(500).json({
      message: 'Error getting messages',
      ok: false
    })
  }
}

export const createMessage = async (req: Request, res: Response<ResponseData>) => {
  try {
    const { title, text, userId } = req.body

    if(!userId){
      return res.status(400).json({
        message: 'Invalid or missing token',
        ok: false
      })
    }

    if(!title || !text){
      return res.status(400).json({
        message: 'Title and text are required',
        ok: false
      })
    }

    const message = Message.create({
      title,
      text,
      user: userId
    })

    await message.save()

    return res.status(201).json({
      message: 'Message created successfully',
      data: [message],
      ok: true
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating message',
      ok: false
    })
  }
}

export const updateMessage = async (req: Request, res: Response<ResponseData>) => {
  try {
    const { title, text, userId } = req.body
    const { id } = req.params

    if(!userId){
      return res.status(400).json({
        message: 'Invalid or missing token',
        ok: false
      })
    }

    if(!title || !text){
      return res.status(400).json({
        message: 'Title and text are required',
        ok: false
      })
    }

    const message = await Message.findOne({
      where: {
        id: Number(id),
        user: {
          id: userId
        }
      },
      relations: ['user']
    })

    if(!message){
      return res.status(404).json({
        message: 'Message not found',
        ok: false
      })
    }

    message.title = title
    message.text = text

    await message.save()

    return res.status(200).json({
      message: 'Message updated successfully',
      data: message,
      ok: true
    })

  } catch (error) {
    return res.status(500).json({
      message: 'Error updating message',
      ok: false
    })
  }
}

export const deleteMessage = async (req: Request, res: Response<ResponseData>) => {
  try {
    const { userId } = req.body
    console.log("🚀 ~ file: messageService.ts:179 ~ deleteMessage ~ userId", userId)
    const { id } = req.params

    if(!userId){
      return res.status(400).json({
        message: 'Invalid or missing token',
        ok: false
      })
    }

    const message = await Message.findOne({
      where: {
        id: Number(id),
        user: {
          id: userId
        }
      },
      relations: ['user'],
      select: ['id', 'title', 'text', 'user']
    })
    console.log("🚀 ~ file: messageService.ts:194 ~ deleteMessage ~ message", message)

    if(!message){
      return res.status(404).json({
        message: 'Message not found',
        ok: false
      })
    }

    await message.remove()

    return res.status(200).json({
      message: 'Message deleted successfully',
      ok: true
    })

  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting message',
      ok: false
    })
  }
}

export const getMyMessages = async (req: Request, res: Response<ResponseData>) => {
  try {
    const { userId } = req.body
    const { dateFilter, limit } = req.query
    let messages: Message[], take = 50

    if(!userId){
      return res.status(400).json({
        message: 'Invalid or missing token',
        ok: false
      })
    }

    if(limit){
      take = Number(limit)
    }

    messages = await Message.find({
      where: {
        user: {
          id: userId
        }
      },
      relations: ['user'],
      select: ['id', 'title', 'text', 'createdAt', 'updatedAt', 'user'],
      order: {
        createdAt: 'DESC'
      },
      take
    })

    if(!messages || messages.length === 0){
      return res.status(404).json({
        message: 'No messages found',
        ok: false
      })
    }

    if(dateFilter){
      messages = messages.filter(message => {
        const messageDate = new Date(message.createdAt)
        return messageDate.getDate() === new Date(dateFilter as string).getDate()
      })
    }

    messages = messages.map(message => {
      const { user, ...rest } = message
      return {
        ...rest,
        user: {
          username: user.username,
          fullName: user.fullName
        }
      }
    }) as Message[]

    return res.status(200).json({
      message: 'Messages found',
      data: messages,
      ok: true
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting messages',
      ok: false
    })
  }
}
