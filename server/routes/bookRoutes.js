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
        const { title, author, category, condition, owner, image, isAvailable} = req.body;
        const book = new Book({ title, author, category, condition, owner, image, isAvailable });
        const newBook = await book.save();
        res.json({ message: 'Libro registrado', newBook: newBook});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un libro en la biblioteca del usuario
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, category, condition, owner, image, isAvailable } = req.body;

        const book = await Book.findByIdAndUpdate(
            id,
            { title, author, category, condition, owner, image, isAvailable },
            { new: true, runValidators: true } // 'new: true' devuelve el documento modificado, 'runValidators' ejecuta las validaciones del esquema
        );

        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        res.json({ message: 'Libro actualizado', book });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        res.json({ message: 'Libro eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el libro' }); // General error para la eliminación
    }
});

module.exports = router;