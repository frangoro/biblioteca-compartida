const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Sirve los archivos estáticos de la aplicación React
app.use(express.static(path.join(__dirname, 'build')));

// Maneja las solicitudes a la ruta principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca-compartida', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


