// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { FaUser, FaLock, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault() // Evita que la página se recargue
    setLoading(true) // Muestra "Cargando..."
    setError('') // Limpia errores anteriores

    // Intentar iniciar sesión con la API
    const result = await authAPI.login(email, password)

    if (result.success) {
      // Si funciona, vamos al dashboard
      navigate('/')
    } else {
      // Si hay error, lo mostramos
      setError(result.error)
    }

    setLoading(false)
  }

  // Función para llenar automáticamente las credenciales de prueba
  const fillCredentials = (userEmail, userPassword) => {
    setEmail(userEmail)
    setPassword(userPassword)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FaShieldAlt className="login-icon" />
          <h1>TANK Security</h1>
          <p>Sistema de Gestión de Flotas</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUser />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              ❌ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Credenciales de prueba - Haz click en cualquier usuario */}
        <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>📝 Haz click en una cuenta para probar:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              onClick={() => fillCredentials('admin@flota.com', 'admin123')}
              style={{ cursor: 'pointer', padding: '8px', borderRadius: '5px', background: '#e2e8f0' }}
            >
              👑 Administrador: admin@flota.com / admin123
            </div>
            <div 
              onClick={() => fillCredentials('tecnico@flota.com', 'tec123')}
              style={{ cursor: 'pointer', padding: '8px', borderRadius: '5px', background: '#e2e8f0' }}
            >
              🔧 Técnico: tecnico@flota.com / tec123
            </div>
            <div 
              onClick={() => fillCredentials('supervisor@flota.com', 'sup123')}
              style={{ cursor: 'pointer', padding: '8px', borderRadius: '5px', background: '#e2e8f0' }}
            >
              ⭐ Supervisor: supervisor@flota.com / sup123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login