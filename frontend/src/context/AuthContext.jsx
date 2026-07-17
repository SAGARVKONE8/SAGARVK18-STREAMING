import React, { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, register as registerApi } from '../api/authApi'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const email = localStorage.getItem('email')
      const name = localStorage.getItem('name')
      const role = localStorage.getItem('role')
      const subscriptionType = localStorage.getItem('subscriptionType')

      if (token && userId) {
        setUser({ token, userId, email, name, role, subscriptionType })
      }
    } catch (err) {
      console.error('Failed to restore session:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (data) => {
    const res = await loginApi(data)
    const u = res.data.data

    const userData = {
      token:            u.token,
      userId:           String(u.userId || u.id),
      email:            u.email,
      name:             u.name || u.fullName,
      role:             u.role,
      subscriptionType: u.subscriptionType || 'FREE',
    }

    setUser(userData)
    localStorage.setItem('token',            userData.token)
    localStorage.setItem('userId',           userData.userId)
    localStorage.setItem('email',            userData.email)
    localStorage.setItem('name',             userData.name || '')
    localStorage.setItem('role',             userData.role || '')
    localStorage.setItem('subscriptionType', userData.subscriptionType)

    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.clear()
  }

  const register = async (data) => {
    const res = await registerApi(data)
    return res.data.data
  }

  const updateSubscription = (subscriptionType) => {
    setUser((prev) => ({ ...prev, subscriptionType }))
    localStorage.setItem('subscriptionType', subscriptionType)
  }

  const isAuthenticated = !!user?.token
  const isAdmin = user?.role === 'ADMIN'
  const isPremium =
    user?.subscriptionType === 'PREMIUM' ||
    user?.subscriptionType === 'STANDARD'

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateSubscription,
        isAuthenticated,
        isAdmin,
        isPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
