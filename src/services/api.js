// src/services/api.js
// Este archivo es el "traductor" entre React y el API

const API_URL = 'http://localhost:4000'

// Servicio de autenticación (para login y registro)
export const authAPI = {
  // Función para iniciar sesión
  login: async (email, password) => {
    try {
      // Enviamos los datos al API
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      // Obtenemos la respuesta del API
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión')
      }

      // Guardamos el token en localStorage (como una llave de acceso)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Función para cerrar sesión
  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  },

  // Función para obtener el usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  // Función para verificar si está logueado
  isAuthenticated: () => {
    return localStorage.getItem('accessToken') !== null
  }
}

// Servicio para vehículos
export const vehiclesAPI = {
  // Obtener todos los vehículos
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/vehicles`)
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Obtener un vehículo por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/vehicles/${id}`)
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Servicio para alertas
export const alertsAPI = {
  // Obtener todas las alertas
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/alerts`)
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}