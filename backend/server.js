// Cargar variables de entorno PRIMERO
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database-memory');

// Verificar variables esenciales
if (!process.env.JWT_SECRET) {
    console.error('❌ ERROR: JWT_SECRET no está definido en .env');
    process.exit(1);
}

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de peticiones (útil para debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));

// Ruta de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de Seguridad GAES - Vehículos de Valores',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            health: '/health'
        }
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.url} no encontrada`
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📝 Ambiente: ${process.env.NODE_ENV}`);
    console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configurado ✅' : 'No configurado ❌'}`);
    console.log(`\n📋 Endpoints disponibles:`);
    console.log(`   - POST   http://localhost:${PORT}/api/auth/login`);
    console.log(`   - GET    http://localhost:${PORT}/api/auth/profile`);
    console.log(`   - GET    http://localhost:${PORT}/health`);
    console.log(`\n💡 Prueba el login con: admin@gaes.com / Admin123!\n`);
});