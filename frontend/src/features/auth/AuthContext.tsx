import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react'
import { setAuthToken } from '../../api/axios'
import type { User } from '../../types'
import {
  authReducer,
  initialAuthState,
  type AuthAction,
  type AuthState,
} from './authReducer'

const AUTH_TOKEN_KEY = 'produitflow_token'
const AUTH_USER_KEY = 'produitflow_user'

interface AuthContextValue {
  state: AuthState
  dispatch: Dispatch<AuthAction>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, baseDispatch] = useReducer(authReducer, initialAuthState)
  const [isInitialized, setIsInitialized] = useState(false)

  console.log('AuthProvider state:', state)

  const dispatch = useCallback<Dispatch<AuthAction>>((action) => {
    if (action.type === 'LOGIN_SUCCESS') {
      sessionStorage.setItem(AUTH_TOKEN_KEY, action.payload.token)
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload.user))
      setAuthToken(action.payload.token)
    }

    if (action.type === 'LOGOUT') {
      sessionStorage.removeItem(AUTH_TOKEN_KEY)
      sessionStorage.removeItem(AUTH_USER_KEY)
      setAuthToken(null)
    }

    baseDispatch(action)
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY)
    const storedUser = sessionStorage.getItem(AUTH_USER_KEY)

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        })
      } catch {
        sessionStorage.removeItem(AUTH_TOKEN_KEY)
        sessionStorage.removeItem(AUTH_USER_KEY)
        setAuthToken(null)
      }
    }

    setIsInitialized(true)
  }, [dispatch])

  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export { AuthContext }
