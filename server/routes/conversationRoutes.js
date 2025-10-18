/**
 * Rutas para las convesaciones guardadas del chat
 */

const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/:userId', async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.params.userId
        })
        .populate('participants', 'username id') // Trae los datos del otro usuario
        .sort({ updatedAt: -1 }); // Las más recientes primero

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: 'Error al cargar conversaciones' });
    }
});

module.exports = router;