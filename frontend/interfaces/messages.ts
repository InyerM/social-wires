import { IUser } from "./"

export interface IMessage {
  id: number
  user: IUser
  title: string
  text: string
  createdAt: Date
  updatedAt: Date
}

export interface IMessageResponse {
  message: string
  data?: IMessage[] | IMessage
  ok?: boolean
}