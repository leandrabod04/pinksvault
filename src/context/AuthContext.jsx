import { createContext, useContext, useEffect, useState } from 'react'
import {
  signUp   as serviceSignUp,
  logIn    as serviceLogIn,
  logOut   as serviceLogOut,
  getSession,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading]         = useState(true)

  // Restore session on first load
  useEffect(() => {
    getSession().then(({ data }) => {
      setCurrentUser(data.session?.user ?? null)
      setLoading(false)
    })
  }, [])

  async function signUp(username, email, password) {
    const { data, error } = await serviceSignUp(username, email, password)
    if (data?.user) setCurrentUser(data.user)
    return { data, error }
  }

  async function logIn(email, password) {
    const { data, error } = await serviceLogIn(email, password)
    if (data?.user) setCurrentUser(data.user)
    return { data, error }
  }

  async function logOut() {
    const { error } = await serviceLogOut()
    if (!error) setCurrentUser(null)
    return { error }
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
