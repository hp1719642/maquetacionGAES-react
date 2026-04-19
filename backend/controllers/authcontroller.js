const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validar que lleguen los datos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione email y contraseña',
            });
        }
        
        // Buscar usuario
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }
        
        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }
        
        // Verificar si está activo
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Usuario desactivado. Contacte al administrador',
            });
        }
        
        // Actualizar último login
        user.lastLogin = new Date();
        await user.save();
        
        // Generar token
        const token = generateToken(user._id);
        
        // Enviar respuesta
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions || [],
                department: user.department,
            },
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
        });
    }
};

// @desc    Obtener perfil
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
        });
    }
};

module.exports = { login, getProfile };