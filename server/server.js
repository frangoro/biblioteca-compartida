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
