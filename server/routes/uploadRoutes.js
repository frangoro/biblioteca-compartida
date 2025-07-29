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

// Sube la foto de perfil (tanto en edición como en creación de usuario)
router.post('/profile-picture', protect, admin, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'user_profiles', // Carpeta en Cloudinary
        resource_type: 'auto'
      }
    );

    res.json({
      message: 'Imagen subida a Cloudinary',
      profilePicUrl: result.secure_url // Devolvemos la URL
    });

  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    res.status(500).json({ message: 'Error interno del servidor al subir la imagen.' });
  }
});

module.exports = router;