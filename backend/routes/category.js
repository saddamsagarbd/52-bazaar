// routes/barcodeRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const multer = require('multer');
const upload = multer();

router.get('/categories', categoryController.getCategories);
router.post('/add-category', upload.none(), categoryController.addCategory);

module.exports = router;