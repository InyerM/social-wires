export interface IAuthUser {
  id?: string
  email: string
  fullName?: string
  username?: string
  password: string
}

export interface IUser {
  id: string
  email: string
  fullName: string
  username: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface IAuthResponse {
  message: string
  user?: IUser
  token?: string
  ok?: boolean
}