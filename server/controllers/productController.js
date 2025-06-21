const { Types } = require("mongoose");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const Product = require("../models/productModel");
import { uploadToCloudinary } from '../utils/cloudinary.js';

exports.getProducts = async (req, res) => {
    try {
        const { name, price, category, page = 1, limit = 20 } = req.query;
        const query = { is_active: true };

        if (name) query.name = { $regex: name, $options: "i" };
        if (price && !isNaN(price)) query.price = Number(price);
        if (category && Types.ObjectId.isValid(category)) query.category = new Types.ObjectId(category);

        const totalProducts = await Product.countDocuments(query);

        console.time("Before: Product Query");
        const products = await Product.find(query)
                        .select("name price imgUrl category")
                        .populate("category", "name")
                        .lean()
                        .skip((page - 1) * limit)
                        .limit(limit)
                        .maxTimeMS(5000);
        console.timeEnd("After: Product Query");

        res.status(200).json({
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            products,
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

async function processProductImageOld(newProduct, file) {

    if (!file) return; // Prevent execution if no file is uploaded

    const uploadsDir = path.join(__dirname, "../public/uploads/products");
    await fsPromises.mkdir(uploadsDir, { recursive: true });

    const fileName = `${newProduct._id}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadsDir, fileName);

    await fsPromises.writeFile(filePath, file.buffer);
    newProduct.imgUrl = `/uploads/products/${fileName}`;
    return await newProduct.save();

}

async function processProductImage(newProduct, file) {
    if (!file) return;

    try {

        if (process.env.NODE_ENV === 'development') {
            const uploadsDir = path.join(__dirname, "../../public/uploads/products");
            await fsPromises.mkdir(uploadsDir, { recursive: true });
            
            const fileName = `${newProduct._id}${path.extname(file.originalname)}`;
            const filePath = path.join(uploadsDir, fileName);
            
            await fsPromises.writeFile(filePath, file.buffer);
            newProduct.imgUrl = `/uploads/products/${fileName}`;
            return await newProduct.save();
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file.buffer, 'products');
        
        // Save the secure URL to your database
        newProduct.imgUrl = result.secure_url;
        return await newProduct.save();
    } catch (error) {
        console.error('Image upload error:', error);
        throw error;
    }
}

exports.addProduct = async (req, res) => {
    try {
        const { name, price, category } = req.body;

        // Check if product already exists within the category
        const existingProduct = await Product.findOne({ name: name.trim(), category });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product with the same name already exists in this category",
            });
        }

        const newProduct = new Product({ name, price, category });

        await newProduct.save();

        res.status(201).json({ success: true, data: newProduct });

        // Process image upload separately
        setImmediate(async () => {
            if (req.file) await processProductImage(newProduct, req.file);
        });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Failed to save product" });
    }
};