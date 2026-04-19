const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'supervisor', 'operador', 'tecnico'],
        default: 'operador',
    },
    permissions: [{
        type: String,
        enum: ['view_dashboard', 'manage_alerts', 'view_vehicles', 'manage_vehicles', 
               'view_routes', 'manage_routes', 'view_reports', 'manage_users', 
               'emergency_protocol', 'configure_system'],
    }],
    department: {
        type: String,
        enum: ['monitoreo', 'operaciones', 'tecnologia', 'administracion'],
        default: 'monitoreo',
    },
    lastLogin: Date,
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);