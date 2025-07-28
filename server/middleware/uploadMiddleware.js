/**
 * Middleware para la subida de imágenes a la nube
 */

const multer = require('multer');
// Configuración de Multer para manejar archivos en memoria
// No los guardamos en disco directamente porque Cloudinary los procesará desde la memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;