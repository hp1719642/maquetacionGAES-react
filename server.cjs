// server.cjs
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');

// Configuración
const PORT = process.env.PORT || 5000;

// Middlewares
server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Autenticación simple
server.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Leer usuarios del db.json
  const db = router.db;
  const users = db.get('users').value();
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword,
      token: `fake-jwt-token-${user.id}`
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }
});

// Registro de usuarios
server.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  const db = router.db;
  const users = db.get('users').value();
  
  // Verificar si el usuario ya existe
  if (users.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'El usuario ya existe'
    });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: role || 'user',
    createdAt: new Date().toISOString()
  };
  
  db.get('users').push(newUser).write();
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.json({
    success: true,
    user: userWithoutPassword,
    token: `fake-jwt-token-${newUser.id}`
  });
});

// Middleware para verificar autenticación
server.use('/api/protected', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || !token.startsWith('fake-jwt-token-')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  next();
});

// Rutas protegidas de ejemplo
server.get('/api/protected/alerts', (req, res) => {
  const db = router.db;
  const alerts = db.get('alerts').value();
  res.json(alerts);
});

// Dashboard stats
server.get('/api/dashboard/stats', (req, res) => {
  const db = router.db;
  
  const stats = {
    totalAlerts: db.get('alerts').value().length,
    activeAlerts: db.get('alerts').filter(a => a.status === 'active').value().length,
    resolvedAlerts: db.get('alerts').filter(a => a.status === 'resolved').value().length,
    totalUsers: db.get('users').value().length,
    activeDevices: db.get('devices').filter(d => d.status === 'active').value().length,
    recentActivity: db.get('activities').take(5).value()
  };
  
  res.json(stats);
});

// Usar el router de json-server para el resto de endpoints
server.use('/api', router);

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📦 JSON Server API available at http://localhost:${PORT}/api`);
});