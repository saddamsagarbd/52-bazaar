const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload");
const productController = require('../controllers/productController');


router.get('/products', productController.getProducts);
router.post('/add-product', upload.single("product_image"), productController.addProduct);

console.log("Product Routes Loaded:", router.stack.map(layer => layer.route?.path).filter(Boolean));

module.exports = router;