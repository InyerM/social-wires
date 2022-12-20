import { createContext } from 'react'
import { IAuthUser } from '../../interfaces'

interface ContextProps {
  isLoggedIn: boolean
  user?: IAuthUser
  
  logginUser: ( email: string, password: string ) => Promise<boolean>
  registerUser: (fullName: string, email: string, password: string, username: string) => Promise<{ hasError: boolean; message?: string; }>
  logout: () => void
}

export const AuthContext = createContext( {} as ContextProps )