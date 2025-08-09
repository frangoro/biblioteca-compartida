/**
 * Controlador para el módulo de usuarios y autenticación.
 * Realiza la lógica de negocio.
 */ 
const User = require('../models/User'); // Ajusta la ruta si es necesario
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// @desc    Crear un nuevo usuario
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res) => {
    const { username, email, password, role, profilePicUrl } = req.body;
    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            if (user.email === email) {
                return res.status(400).json({ message: 'El email ya está registrado' });
            }
            if (user.username === username) {
                return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
            }
        }
        user = new User({
            username,
            email,
            password,
            role,
            profilePicUrl,
        });

        await user.save();

        // No devolver la contraseña en la respuesta
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: userResponse,
        });
    } catch (error) {
        console.error(error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).send('Error del servidor');
    }
};

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin (deberías proteger esta ruta)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Excluir contraseña
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/users/:id
// @access  Private/Admin o el propio usuario
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    const loggedInUserId = req.user.id;
    const loggedInUserRole = req.user.role;
    if (loggedInUserRole !== 'admin' && loggedInUserId !== id) {
        // Si no es admin y no es su propio perfil, rechazar.
        return res.status(403).json({ message: 'No tienes permiso para editar este usuario.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    try {
        const user = await User.findById(id).select('-password'); // Excluir contraseña
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};

// @desc    Obtener un usuario por username
// @route   GET /api/users/:username
// @access  Usuario logado
exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error });
  }
};


// @desc    Actualizar un usuario
// @route   PUT /api/users/:id
// @access  Private/Admin o el propio usuario
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role, profilePicUrl } = req.body;
    const loggedInUserId = req.user.id;
    const loggedInUserRole = req.user.role;

    // Verificación de seguridad:
    // Solo permitir la edición si el usuario es administrador O si el ID
    // del usuario autenticado coincide con el ID del usuario a editar.
    if (loggedInUserRole !== 'admin' && loggedInUserId.toString() !== id) {
        return res.status(403).json({ message: 'No tienes permiso para editar este usuario.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    try {
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el nuevo username o email ya existen en otro usuario
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username, _id: { $ne: id } });
            if (existingUsername) {
                return res.status(400).json({ message: 'El nombre de usuario ya está en uso por otro usuario' });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email, _id: { $ne: id } });
            if (existingEmail) {
                return res.status(400).json({ message: 'El email ya está en uso por otro usuario' });
            }
            user.email = email;
        }
        
        if (password) {
            if (password.length < 6) {
                 return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
            }
            user.password = password;
        }
        user.role = role;
        user.profilePicUrl = profilePicUrl;

        const updatedUser = await user.save();

        // No devolver la contraseña en la respuesta
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: 'Usuario actualizado exitosamente',
            user: userResponse,
        });
    } catch (error) {
        console.error(error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).send('Error del servidor');
    }
};

// @desc    Eliminar un usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin o el propio usuario
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.deleteOne(); // o User.findByIdAndDelete(id)

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
};