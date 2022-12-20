import { AuthState } from './AuthProvider'
import { IAuthUser } from '../../interfaces'

type AuthAction = 
| { type: 'AUTH_LOGIN', payload: IAuthUser }
| { type: 'AUTH_LOGOUT' }

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOGIN':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true
      }

    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: undefined,
        isLoggedIn: false
      }
      
    default:
      return state
  }
}