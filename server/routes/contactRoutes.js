const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Definición de rutas
// POST /api/contact/
router.post('/', contactController.sendContactEmail);

module.exports = router;