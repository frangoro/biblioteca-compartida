/**
 * Rutas para la gestión de libros del usuario
 */

const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Lista de libros del usuario
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
});

// Agregar un libro en la biblioteca del usuario
router.post('/add', async (req, res) => {
    try {
        const { author, category, condition, owner, image, isAvailable} = req.body;
        const book = new Book({ author, category, condition, owner, image, isAvailable });
        await book.save();
        res.json({ message: 'Libro registrado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;