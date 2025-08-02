/**
 * Endpoints para la gestión de usuarios.
 */
const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

// Importamos los middlewares para proteger las rutas
const { protect, admin } = require('../middleware/authMiddleware');

// Ruta para crear usuarios (puede ser pública o solo para admins)
// Opción 1: Cualquiera puede registrarse
router.post('/', createUser); 
// Opción 2: Solo un admin puede crear usuarios
// router.post('/', protect, admin, createUser);

// Rutas de administración (protegidas)
router.route('/')
    .get(protect, admin, getAllUsers); // Solo admins pueden ver todos los usuarios

router.route('/:id')
    .get(protect, getUserById)      // Solo admins pueden ver cualquier usuario por ID (o usuario actual puede ver su propio perfil)
    .put(protect, updateUser)       // Solo admins pueden editar cualquier usuario (o usuario actual puede editar su propio perfil)
    .delete(protect, admin, deleteUser);   // Solo admins pueden eliminar cualquier usuario

module.exports = router;