// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Endpoint de LOGIN
server.post('/login', (req, res) => {
  const { email, password } = req.body
  const db = router.db
  const user = db.get('users').find(u => u.email === email && u.password === password).value()
  
  if (user) {
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
    res.json({
      accessToken: token,
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }
    })
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' })
  }
})

// Endpoint de REGISTRO
server.post('/register', (req, res) => {
  const { email, password, name, role } = req.body
  const db = router.db
  const existingUser = db.get('users').find(u => u.email === email).value()
  
  if (existingUser) {
    res.status(400).json({ error: 'El usuario ya existe' })
  } else {
    const newUser = { 
      id: Date.now(), 
      email, 
      password, 
      name, 
      role: role || 'tecnico' 
    }
    db.get('users').push(newUser).write()
    
    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64')
    res.json({
      accessToken: token,
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name, 
        role: newUser.role 
      }
    })
  }
})

// Middleware de autenticación (opcional)
server.use((req, res, next) => {
  const authHeader = req.headers.authorization
  if (req.method === 'GET' || (authHeader && authHeader.startsWith('Bearer '))) {
    next()
  } else if (req.method === 'POST' && (req.path === '/login' || req.path === '/register')) {
    next()
  } else {
    res.status(401).json({ error: 'Se requiere autenticación' })
  }
})

server.use(router)
server.listen(4000, () => {
  console.log('')
  console.log('🚀 ¡Servidor corriendo exitosamente!')
  console.log('=====================================')
  console.log('📍 API disponible en: http://localhost:4000')
  console.log('')
  console.log('📋 Endpoints disponibles:')
  console.log('   POST   /login     - Iniciar sesión')
  console.log('   POST   /register  - Registrar usuario')
  console.log('   GET    /vehicles  - Listar vehículos')
  console.log('   GET    /alerts    - Listar alertas')
  console.log('   GET    /users     - Listar usuarios')
  console.log('')
  console.log('🔑 Credenciales de prueba:')
  console.log('   Admin:    admin@flota.com / admin123')
  console.log('   Técnico:  tecnico@flota.com / tec123')
  console.log('')
})