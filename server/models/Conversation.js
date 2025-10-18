/** Modelo para las convesaciones del chat */
const mongoose = require('mongoose');

// Sub-esquema para el Mensaje
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia a tu modelo de Usuario
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Esquema de la Conversación
const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [messageSchema] // Array de mensajes dentro de la conversación
}, {
    timestamps: true // Añade createdAt y updatedAt a la conversación
});

module.exports = mongoose.model('Conversation', conversationSchema);