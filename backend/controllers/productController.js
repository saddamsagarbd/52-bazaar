const { Types } = require('mongoose');
const path = require('path');
const fs = require('fs');
const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {

    try {
        
        const { name, price, category } = req.query;

        const query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (price) {
            if (!isNaN(price)) {
                query.price = Number(price);
            } else {
                return res.status(400).json({ message: 'Price must be a number' });
            }
        }

        if (category) {
            if (Types.ObjectId.isValid(category)) {
                query.category = new Types.ObjectId(category);
            } else {
                return res.status(400).json({ message: 'Invalid category ID format' });
            }
        }

        // const products = await Product.find(query)
        //     .populate('category', 'name')
        //     .sort({ created_at: -1 })
        //     .maxTimeMS(5000);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const products = await Product.find({ is_active: true })
            .select('name price imgUrl category')
            .populate('category', 'name')
            .lean()
            .skip((page - 1) * limit)
            .limit(limit)
            .maxTimeMS(5000);

        res.status(200).json(products);
        
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

        if (req.file) {
            const uploadsDir = path.join(__dirname, '../public/uploads/products');
            if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

            const ext = path.extname(req.file.originalname);
            const fileName = `${newProduct._id}${ext}`;
            const filePath = path.join(uploadsDir, fileName);

            fs.writeFileSync(filePath, req.file.buffer);

            newProduct.imgUrl = `/uploads/products/${fileName}`;
            await newProduct.save();
        }

        res.status(200).json({ success: true, data: newProduct });
    } catch (error) {
        console.error('Add Category Error:', error);
        res.status(500).json({ success: false, message: "Failed to save product" });
    }
};