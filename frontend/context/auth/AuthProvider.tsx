import { FC, useReducer, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

import { wiresApi } from '../../api'
import { IAuthUser, IAuthResponse } from '../../interfaces'
import { AuthContext, authReducer } from './'

export interface AuthState {
  isLoggedIn: boolean
  user?: IAuthUser
}

interface Props {
  children: React.ReactNode
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined
}

export const AuthProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE )
  const router = useRouter()

  useEffect(() => {
    checkToken()
  }, [router])

  const checkToken = async () => {
    const token = localStorage.getItem('token')

    try {   
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const { data } = await wiresApi.get<IAuthResponse>('/auth/user', config)
        const { user, ok } = data
  
        if (user && ok) {
          dispatch({
            type: 'AUTH_LOGIN',
            payload: user
          })
        }
      }
    } catch (error) {
      if (token) {
        localStorage.removeItem('token')
      }
    }
  }
  

  const logginUser = async( email: string, password: string ): Promise<boolean> => {
    try {
      const { data } = await wiresApi.post<IAuthResponse>('/auth/login', { email, password })
      const { token, user, ok } = data

      if (!ok || !token) {
        return false
      }

      localStorage.setItem('token', token )

      dispatch({
        type: 'AUTH_LOGIN',
        payload: user as IAuthUser
      })

      return true
    } catch (error) {
      return false
    }
  }

  const registerUser = async(name: string, email: string, password: string, username: string): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await wiresApi.post<IAuthResponse>('/auth/register', { fullName: name, email, password, username })
      const { token, user, ok, message } = data

      if (!ok || !token) {
        return {
          hasError: true,
        }
      }

      localStorage.setItem('token', token )

      dispatch({
        type: 'AUTH_LOGIN',
        payload: user as IAuthUser
      })

      return {
        hasError: false
      }
    } catch (error) {
      if( axios.isAxiosError(error) ) {
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }

      return {
        hasError: true,
        message: 'An error has ocurred, try again'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.reload()
  }

  return (
    <AuthContext.Provider value={{ 
      ...state,

      //methods
      logginUser,
      registerUser,
      logout
    }}>
      { children }
    </AuthContext.Provider>
  )
}
