/**
 * Endpoint para la subida de imágenes a la nube
 */
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // middleware de Multer
const User = require('../models/User'); // modelo de usuario de Mongoose

// Middleware de autenticación ya que esta ruta es protegida
const { protect, admin } = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinaryConfig'); // configuración de Cloudinary

// Ruta para actualizar el perfil del usuario con una nueva foto
router.put('/:id/profile-picture', protect, admin, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.id;
    // req.file contiene la información del archivo subido por Multer
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    // Subir la imagen a Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'user_profiles', // Carpeta donde se guardarán las imágenes en Cloudinary
        resource_type: 'auto' // Detecta automáticamente el tipo de archivo (imagen, video, etc.)
      }
    );

    // `result.secure_url` contiene la URL pública de la imagen en Cloudinary
    const profilePicUrl = result.secure_url;

    // Actualizar la URL de la foto de perfil en tu base de datos MongoDB
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicUrl: profilePicUrl },
      { new: true, runValidators: true } // new: true devuelve el documento actualizado
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({
      message: 'Foto de perfil actualizada con éxito',
      profilePicUrl: user.profilePicUrl
    });

  } catch (error) {
    console.error('Error al subir la imagen o actualizar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar la foto de perfil.' });
  }
});

module.exports = router;