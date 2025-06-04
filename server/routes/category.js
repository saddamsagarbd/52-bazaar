const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const multer = require('multer');
const upload = multer();

router.get('/api/categories', categoryController.getCategories);
router.post('/api/add-category', upload.none(), categoryController.addCategory);

module.exports = router;