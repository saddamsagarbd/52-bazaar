const { Types } = require('mongoose');
const path = require('path');
const fs = require('fs');
const { connA } = require('../db-config/db-conn');
const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');
const Product = ProductModel(connA);
const Category = CategoryModel(connA);

exports.getProducts = async (req, res) => {
    // const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer header

    // if (!token) {
    //     return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    // }

    try {
        const { name, price, category } = req.query;

        const query = {};

        // Name filter
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        // Price filter - better handling for numeric values
        if (price) {
            if (!isNaN(price)) {
                query.price = Number(price);
            } else {
                return res.status(400).json({ message: 'Price must be a number' });
            }
        }

        // Category filter
        if (category) {
            if (Types.ObjectId.isValid(category)) {
                query.category = new Types.ObjectId(category);
            } else {
                return res.status(400).json({ message: 'Invalid category ID format' });
            }
        }

        const products = await Product.find(query)
            .populate('category', 'name', 'price')
            .sort({ created_at: -1 })
            .maxTimeMS(5000); // Add timeout for Vercel

        res.status(200).json(products);

        // const products = await Product.find(query)
        //     .populate('category', 'name')
        //     .sort({ created_at: -1 });

        // console.log('Products found:', products);

        // res.status(200).json(products);
        
    } catch (err) {
        // Log the actual error message and stack trace
        console.error('Error fetching products:', err.message);
        console.error(err.stack);

        // Send server error response
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.addProduct = async (req, res) => {
    
    try {
        const { name, price, category } = req.body;

        // Check for existing product with same name and category
        const existingProduct = await Product.findOne({ 
            name: name.trim(), 
            category 
        });

        if(existingProduct){
            return res.status(400).json({ 
                success: false, 
                message: "Product with the same name already exists in this category" 
            });
        }

        const newProduct = new Product({
            name,
            price,
            category,
        });
        
        await newProduct.save();

        // Handle image only after product saved
        if (req.file) {
            const uploadsDir = path.join(__dirname, '../public/uploads/products');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

            const ext = path.extname(req.file.originalname);
            const fileName = `${newProduct._id}${ext}`;
            const filePath = path.join(uploadsDir, fileName);

            fs.writeFileSync(filePath, req.file.buffer); // Save file to disk

            newProduct.imgUrl = `/uploads/products/${fileName}`;
            await newProduct.save(); // Update product with image URL
        }

        res.status(200).json({ success: true, data: newProduct });
    } catch (error) {
        console.error('Add Category Error:', error);
        res.status(500).json({ success: false, message: "Failed to save product" });
    }
};