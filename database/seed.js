const mongoose = require('mongoose');
const User = require('../backend/models/User');

const seedDatabase = async () => {
    try {
        console.log('📦 Conectando a MongoDB en memoria...');
        
        // Conectar a MongoDB (usando la misma URI que el servidor)
        await mongoose.connect('mongodb://localhost:27017/vehiculos_valores');
        
        console.log('✅ Conectado a MongoDB\n');
        
        // Limpiar usuarios existentes
        console.log('🗑️  Limpiando usuarios existentes...');
        await User.deleteMany();
        
        // Crear usuarios de prueba
        console.log('👥 Creando usuarios...\n');
        
        const users = await User.create([
            {
                name: 'Administrador GAES',
                email: 'admin@flota.com ',
                password: 'Admin123!',
                role: 'admin',
                department: 'administracion',
                permissions: ['view_dashboard', 'manage_alerts', 'view_vehicles', 'manage_users'],
                isActive: true,
            },
            {
                name: 'Operador Central',
                email: 'tecnico@flota.com',
                password: 'tec123!',
                role: 'operador',
                department: 'monitoreo',
                permissions: ['view_dashboard', 'view_vehicles'],
                isActive: true,
            },
        ]);
        
        console.log(`✅ Creados ${users.length} usuarios:\n`);
        
        console.log('\n📋 CREDENCIALES DE PRUEBA:');
        console.log('═══════════════════════════════════');
        console.log('🔑 Admin:      admin@gaes.com / Admin123!');
        console.log('👤 Operador:   operador@gaes.com / Oper123!');
        console.log('═══════════════════════════════════\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedDatabase();