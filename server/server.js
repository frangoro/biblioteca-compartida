/**
 * Configuración del servidor con Express.js
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('🔥 Conectado a MongoDB'))
  .catch(err => console.error(err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando!');
});

// Rutas para las pantallas de libros del usuario
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

// Rutas para las pantallas de gestión de usuarios
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

//TODO: Rutas para el resto de pantallas

// Configurar puerto y escuchar
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
