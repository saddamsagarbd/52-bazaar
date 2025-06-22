import express from 'express';
const router = express.Router();
import categoryController from '../controllers/categoryController.js';
import multer from 'multer';
const upload = multer();

router.get('/categories', categoryController.getCategories);
router.post('/add-category', upload.none(), categoryController.addCategory);

export default router;