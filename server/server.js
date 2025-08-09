/**
 * Configuración del servidor con Express.js
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

/* Middleware */
// Middleware para parsear JSON 
app.use(express.json());
// Middleware para parsear URL-encoded data
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.REACT_APP_API_URL
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

/* Chat con Socket.IO */

// Crea un servidor HTTP con Express
const server = http.createServer(app);

// Crea una instancia de Socket.IO, conectándola al servidor HTTP
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_API_URL, // Permite la conexión desde el cliente de React
    methods: ["GET", "POST"]
  }
});

// Escucha por nuevas conexiones de clientes
io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado:', socket.id);

  // Escucha por un evento de chat
  socket.on('chat message', (msg) => {
    console.log('Mensaje recibido:', msg);
    // Emite el mensaje a todos los clientes conectados
    io.emit('chat message', msg); 
  });

  // Escucha por desconexiones
  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });
});

// Inicia el servidor tanto para HTTP como para Socket.IO
server.listen(process.env.PORT || 5000, () => {
  console.log('Servidor de chat escuchando en el puerto 5000');
});
