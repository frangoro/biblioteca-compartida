const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Loan = require('../models/Loan');
const User = require('../models/User'); // Necesario para populate
// Importamos los middlewares para proteger las rutas
const { protect, admin } = require('../middleware/authMiddleware');

// Middleware de autenticación (ej. para proteger estas rutas)
// const authMiddleware = require('../middleware/authMiddleware'); // Si tienes uno

// --- GET /api/users/:userId/lent-books ---
router.get('/:userId/lent-books', protect, async (req, res) => {
  try {
    // Protección de ruta: Asegurarse de que el usuario que consulta sea el mismo que el de la ruta
    // En una app real, `req.userId` vendría de un token JWT después de la autenticación.
    if (!req.userId || req.params.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Acceso denegado. ID de usuario no coincide.' });
    }

    // Buscar préstamos donde el 'owner' (dueño del libro) es el usuario logueado
    const loans = await Loan.find({ owner: req.userId, status: { $in: ['approved', 'pending'] } })
      .populate('book', 'title author coverImageUrl') // Selecciona campos específicos del libro
      .populate('borrower', 'username') // Selecciona el username del prestatario
      .exec();

    res.json(loans);
  } catch (error) {
    console.error('Error al obtener libros prestados por el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- GET /api/users/:userId/borrowed-books ---
router.get('/:userId/borrowed-books', protect, async (req, res) => {
  try {
    if (!req.userId || req.params.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Acceso denegado. ID de usuario no coincide.' });
    }

    // Buscar préstamos donde el 'borrower' (prestatario) es el usuario logueado
    const borrowedLoans = await Loan.find({ borrower: req.userId, status: { $in: ['approved', 'pending'] } })
      .populate('book', 'title author coverImageUrl owner') // Incluye el owner del libro para mostrar "prestado por"
      .populate('owner', 'username') // Popula el username del dueño del libro
      .exec();

    res.json(borrowedLoans);
  } catch (error) {
    console.error('Error al obtener libros tomados prestados por el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- GET /api/users/:userId/loan-requests ---
router.get('/:userId/loan-requests', protect, async (req, res) => {
  try {
    if (!req.userId || req.params.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Acceso denegado. ID de usuario no coincide.' });
    }

    // Buscar solicitudes de préstamo pendientes donde el 'owner' del préstamo (dueño del libro) es el usuario logueado
    const requests = await Loan.find({ owner: req.userId, status: 'pending' })
      .populate('book', 'title author coverImageUrl')
      .populate('borrower', 'username') // Popula el username del prestatario
      .exec();

    res.json(requests);
  } catch (error) {
    console.error('Error al obtener solicitudes de préstamo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- POST /api/loans (solicitar préstamo) ---
router.post('/', protect, async (req, res) => { // La ruta base es /api/loans
  const { bookId } = req.body;
  const borrowerId = req.userId; // El usuario autenticado es el que solicita el préstamo

  if (!bookId || !borrowerId) {
    return res.status(400).json({ message: 'bookId y un usuario autenticado son requeridos.' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado.' });
    }
    if (!book.isAvailable) {
      return res.status(409).json({ message: 'El libro no está disponible para préstamo en este momento.' });
    }
    // Convertir a String para comparar IDs
    if (book.owner.toString() === borrowerId.toString()) {
        return res.status(400).json({ message: 'No puedes solicitar un préstamo de tu propio libro.' });
    }

    const existingLoan = await Loan.findOne({
      book: bookId,
      borrower: borrowerId,
      status: { $in: ['pending', 'approved'] }
    });
    if (existingLoan) {
      return res.status(409).json({ message: 'Ya tienes una solicitud de préstamo pendiente o un préstamo activo para este libro.' });
    }

    const newLoan = new Loan({
      book: bookId,
      borrower: borrowerId,
      owner: book.owner, // El dueño del libro es el dueño del préstamo
      status: 'pending'
    });
    await newLoan.save();

    res.status(201).json({ message: 'Solicitud de préstamo enviada con éxito.', loan: newLoan });

  } catch (error) {
    console.error('Error al solicitar préstamo:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de libro o usuario inválido.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al procesar la solicitud de préstamo.' });
  }
});

// --- PUT /api/loans/:loanId/approve ---
router.put('/:loanId/approve', protect, async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId).populate('book');

    if (!loan) {
      return res.status(404).json({ message: 'Solicitud de préstamo no encontrada.' });
    }
    // Verificar que el usuario que aprueba es el dueño del libro (y por ende el 'owner' del préstamo)
    if (!req.userId || loan.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para aprobar esta solicitud.' });
    }
    if (loan.status !== 'pending') {
      return res.status(400).json({ message: 'La solicitud ya no está pendiente.' });
    }

    loan.status = 'approved';
    loan.loanDate = new Date();
    await loan.save();

    await Book.findByIdAndUpdate(loan.book._id, { isAvailable: false });

    res.json({ message: 'Solicitud de préstamo aprobada con éxito.', loan });
  } catch (error) {
    console.error('Error al aprobar solicitud de préstamo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- PUT /api/loans/:loanId/reject ---
router.put('/:loanId/reject', protect, async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId).populate('book');

    if (!loan) {
      return res.status(404).json({ message: 'Solicitud de préstamo no encontrada.' });
    }
    if (!req.userId || loan.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para rechazar esta solicitud.' });
    }
    if (loan.status !== 'pending') {
      return res.status(400).json({ message: 'La solicitud ya no está pendiente.' });
    }

    loan.status = 'rejected';
    await loan.save();

    res.json({ message: 'Solicitud de préstamo rechazada con éxito.', loan });
  } catch (error) {
    console.error('Error al rechazar solicitud de préstamo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// --- PUT /api/loans/:loanId/return ---
router.put('/:loanId/return', protect, async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId).populate('book');

    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado.' });
    }
    // Permitir que el prestatario o el dueño del libro marquen como devuelto
    if (!req.userId || (loan.borrower.toString() !== req.userId.toString() && loan.owner.toString() !== req.userId.toString())) {
        return res.status(403).json({ message: 'No tienes permiso para marcar este préstamo como devuelto.' });
    }
    if (loan.status !== 'approved') {
      return res.status(400).json({ message: 'El préstamo no está en estado "aprobado" para ser devuelto.' });
    }

    loan.status = 'returned';
    loan.returnDate = new Date();
    await loan.save();

    await Book.findByIdAndUpdate(loan.book._id, { isAvailable: true });

    res.json({ message: 'Libro marcado como devuelto con éxito.', loan });
  } catch (error) {
    console.error('Error al marcar préstamo como devuelto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;