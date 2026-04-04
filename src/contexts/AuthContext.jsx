import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (credentials) => {
    // Validar credenciales
    const validUsers = {
      'admin@flota.com': { password: 'admin123', role: 'admin', name: 'Administrador' },
      'tecnico@flota.com': { password: 'tec123', role: 'tecnico', name: 'Técnico de Control' }
    }

    const userData = validUsers[credentials.username]
    
    if (userData && userData.password === credentials.password) {
      const user = {
        username: credentials.username,
        name: userData.name,
        role: userData.role,
        permissions: userData.role === 'admin' ? ['all'] : ['view']
      }
      
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isLoggedIn', 'true')
      setUser(user)
      return { success: true, user }
    }
    
    return { success: false, error: 'Credenciales incorrectas' }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}