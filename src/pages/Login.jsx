import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaUser, FaLock, FaShieldAlt } from 'react-icons/fa'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = login(credentials)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
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
              type="text"
              placeholder="Usuario"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>
          
          <div className="input-group">
            <FaLock />
            <input
              type="password"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit">Iniciar Sesión</button>
        </form>
        
        <div className="credentials-info">
          <p>📝 Credenciales de prueba:</p>
          <div>👑 Admin: admin@flota.com / admin123</div>
          <div>🔧 Técnico: tecnico@flota.com / tec123</div>
        </div>
      </div>
    </div>
  )
}

export default Login