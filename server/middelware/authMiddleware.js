/**
 * Middlewares de Autenticación (protect)  y Autorización (admin) 
 */ 
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de Autenticación (protect). 
// Este middleware verificará el token JWT y adjuntará los datos del usuario al objeto request.
const protect = async (req, res, next) => {
    let token;

    // Buscamos el token en los headers de autorización
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtenemos el token (sin el 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Verificamos el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscamos el usuario por el ID del token y lo adjuntamos a la request (sin mandar el campo password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            }
            // Continúa al siguiente middleware: protect --> admin
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

// Middleware de Autorización para las pantallas del Administrador (admin)
// Este middleware verificará si el usuario autenticado tiene el rol de 'admin'. Debe usarse siempre después del middleware protect.
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        // Se manda al controlador indicado en la request
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado, no eres administrador' }); // 403 Forbidden
    }
};

module.exports = { protect, admin };