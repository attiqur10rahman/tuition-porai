import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('tp_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => { localStorage.removeItem('tp_token'); delete api.defaults.headers.common['Authorization'] })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    localStorage.setItem('tp_token', r.data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${r.data.token}`
    setUser(r.data.user)
    return r.data.user
  }

  const signup = async (name, email, password, tutionName, phone) => {
    const r = await api.post('/auth/signup', { name, email, password, tutionName, phone })
    localStorage.setItem('tp_token', r.data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${r.data.token}`
    setUser(r.data.user)
    return r.data.user
  }

  const logout = () => {
    localStorage.removeItem('tp_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
