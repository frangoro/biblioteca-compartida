/**
 * Rutas para la gestión de libros del usuario
 */

const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Búsqueda de libros
router.get('/', async (req, res) => {
    try {
        const { searchTerm, authorFilter } = req; // Obtener parámetros de consulta

        let query = {}; // Objeto de consulta para MongoDB

        // Criterio de búsqueda por título o descripción (case-insensitive)
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } }, // 'i' para ignorar mayúsculas/minúsculas
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Criterio de filtrado por autor (case-insensitive)
        if (authorFilter) {
            query.author = { $regex: authorFilter, $options: 'i' };
        }

        // Ejecutar la consulta en la base de datos
        const books = await Book.find(query);
        res.json(books);

    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Detalles del libro
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.json(book);
    } catch (error) {
        console.error('Error al obtener el libro por ID:', error);
        // Para IDs inválidos de MongoDB, Mongoose lanza un error de "CastError"
        if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID de libro inválido' });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
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