const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

router.post('/api/admin/login', authController.login);

module.exports = router;
