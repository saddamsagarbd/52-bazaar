// routes/barcodeRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

// Route to generate barcode for a user
router.post('/admin/login', authController.login);

module.exports = router;
