// routes/barcodeRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/categories', categoryController.getCategories);
router.post('/add-category', categoryController.addCategory);

module.exports = router;