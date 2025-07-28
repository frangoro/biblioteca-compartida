/**
 * Configuración del servidor con Express.js
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');

const app = express();

/* Middleware */
// Middleware para parsear JSON 
app.use(express.json());
// Middleware para parsear URL-encoded data
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000' // frontend
}));
app.use(morgan('dev'));

// --- Simulación/placeholder para `req.userId` ---
// En una aplicación real, este middleware se reemplazaría por tu lógica de autenticación
// (ej. JWT verification) que establecería `req.userId` después de verificar un token.
app.use(async (req, res, next) => {
  // Para pruebas, puedes hardcodear un ID de usuario existente en tu DB:
  //req.userId = '66301a1f4d4b4a001a234b11'; // <-- ¡IMPORTANTE! Reemplaza esto

  // O si tienes un token en la cabecera (ej. Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId; // Asume que tu JWT decodificado tiene un `userId`
    } catch (error) {
      console.error('Error al verificar token JWT:', error);
      // Opcional: Puedes devolver un 401 si el token es inválido
    }
  }
  next();
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando!');
});

// Rutas para las pantallas de libros del usuario
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

// Rutas para la autenticación de usuarios
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rutas para las pantallas de gestión de préstamos
const loanRoutes = require('./routes/loanRoutes');
app.use('/api/loans', loanRoutes);

// Rutas para la gestión de usuarios
app.use('/api/users', userRoutes);

// Ruta para la subida de imágenes a la nube
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);


// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('🔥 Conectado a MongoDB'))
  .catch(err => console.error(err));

// Configurar puerto y escuchar
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
