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


module.exports = router;
