/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  FC,
} from 'react'
import Router, { useRouter } from 'next/router'

type props = {
  auth: firebase.auth.Auth
  children: React.ReactNode
}

type AuthContextType = {
  user: {}
  isAuthenticated: boolean
  loading: boolean
  login: Function<Promise<firebase.auth.UserCredential>>
  logout?: Promise<void>
  getIdToken: Function<Promise<string>>
}

const AuthContext = createContext<AuthContextType>({
  user: {},
  isAuthenticated: true,
  loading: false,
})

export const AuthProvider: FC<props> = ({ auth, children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserFromCookies() {
      setLoading(false)
    }
    loadUserFromCookies()
  }, [])

  const login = async (email: string, password: string) => {
    const credential = await auth.signInWithEmailAndPassword(email, password)
    return credential
  }

  const logout = (email: string, password: string) => {
    /*
    Cookies.remove('token')
    setUser(null)
    window.location.pathname = '/login'*/
  }

  const getIdToken = async () => {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true)
    return idToken
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: false,
        user,
        login,
        loading,
        logout,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  return context
}

export const ProtectRoute = ({ Component: Component, ...rest }) => {
  return () => {
    const { user, isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isAuthenticated && !loading) Router.push('/login')
    }, [loading, isAuthenticated])

    return <Component {...rest} />
  }
}
