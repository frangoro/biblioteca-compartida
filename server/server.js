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
const Conversation = require('./models/Conversation');

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

// Ruta para la subida de imágenes a la nube
const conversationsRoutes = require('./routes/conversationRoutes');
app.use('/api/conversations', conversationsRoutes);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('🔥 Conectado a MongoDB'))
  .catch(err => console.error(err));

/* Chat con Socket.IO */

// Crea un servidor HTTP con Express
const server = http.createServer(app);

// Crea una instancia de Socket.IO (el servidor del chat), conectándola al servidor HTTP
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_API_URL, // Permite la conexión desde el cliente de React
    methods: ["GET", "POST"]
  }
});

const userSockets = new Map(); // Mapa para guardar el userId y su socket.id

// Escucha por nuevas conexiones de clientes
// socket representa la conexión individual de cada usuario
io.on('connection', (socket) => {
  console.log(`Un usuario se ha conectado al servidor, pero no al chat:`, socket.id);
  
  // Escucha el evento 'join' para que el usuario se identifique
  socket.on('join', (user) => {
    userSockets.set(user.id, socket.id); // Guarda la relación userId -> socket.id
    console.log(`Usuario ${user.username} se ha unido al chat`);
    console.log('userSockets:', userSockets);
  });

  // Escucha por un evento de chat. Cuando un usuario envía un mensaje privado
  // busca el socket del destinatario y le envía el mensaje
  socket.on('private message', async ({ fromUserId, toUserId, message }) => {
    console.log(`Mensaje privado de ${fromUserId} a ${toUserId}: ${message}`);
    //TODO eliminar: const recipientSocketId = userSockets.get(toUserId);
    const recipientSocketId = userSockets.get(toUserId);
    // Si está conectado al chat, le envía el mensaje
    if (recipientSocketId) {
      console.log(`Usuario ${toUserId} está en el socket ${recipientSocketId}.`);
      io.to(recipientSocketId).emit('private message', {toUserId, fromUserId, message });
    } else {
      // Si el destinatario no está en línea, puedes guardar el mensaje en la base de datos
      console.log(`Usuario ${toUserId} no está en línea. Mensaje guardado.`);
      // TODO: Lógica para guardar en la DB
    }
    // 2. Lógica de MongoDB: Buscar o Crear la Conversación
    
    // Definir los IDs de los participantes de forma consistente (ordenados)
    const participantsArray = [fromUserId, toUserId].sort();

    try {
        let conversation = await Conversation.findOne({
            participants: { $all: participantsArray } // Busca una conversación que contenga AMBOS IDs
        });

        // Si la conversación no existe, la creamos
        if (!conversation) {
            conversation = await Conversation.create({
                participants: participantsArray,
                messages: []
            });
        }

        // 3. Añadir el nuevo mensaje
        const newMessage = {
            sender: fromUserId,
            content: message
        };
        conversation.messages.push(newMessage);
        await conversation.save();

        // 4. Enviar el mensaje por Socket.IO (ahora con el ID del mensaje para confirmación)
        if (recipientSocketId) {
            // Envía el mensaje completo (incluyendo el timestamp generado por Mongoose)
            io.to(recipientSocketId).emit('private message', {
                fromUserId: fromUserId,
                message: newMessage.content,
                timestamp: newMessage.timestamp,
                conversationId: conversation._id
            });
        }

        // Opcional: Envía al propio emisor el mensaje con el timestamp
        socket.emit('private message', {
             fromUserId: fromUserId,
             message: newMessage.content,
             timestamp: newMessage.timestamp,
             conversationId: conversation._id
        });


    } catch (error) {
        console.error("Error al guardar el mensaje en DB:", error);
    }
  });

  // Escucha por desconexiones. Cuando un usuario se desconecta, elimina su socket del mapa
  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado:', socket.id);
    
    // Encuentra el userId asociado al socket.id y elimínalo
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`Usuario ${userId} ha sido desconectado`);
        break;
      }
    }
    console.log('userSockets:', userSockets);
  });
});

// Inicia el servidor tanto para HTTP como para Socket.IO
server.listen(process.env.PORT || 5000, () => {
  console.log('Servidor de chat escuchando en el puerto 5000');
});

// Captura el evento 'close' para reinicios limpios
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Port 5000 is busy. Trying to restart...');
    setTimeout(() => {
      server.close();
      server.listen(process.env.PORT || 5000);
    }, 1000);
  }
});