const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rutas públicas
router.post('/login', login);

// Rutas protegidas
router.get('/profile', protect, getProfile);

module.exports = router;