/**
 * Archivo de Configuración de Cloudinary
 */

require('dotenv').config(); // Carga las variables de entorno

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Usa HTTPS
});

module.exports = cloudinary;