const { Types } = require("mongoose");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const Product = require("../models/productModel");

exports.getProducts = async (req, res) => {
    try {
        const { name, price, category, page = 1, limit = 20 } = req.query;
        const query = { is_active: true };

        if (name) query.name = { $regex: name, $options: "i" };
        if (price && !isNaN(price)) query.price = Number(price);
        if (category && Types.ObjectId.isValid(category)) query.category = new Types.ObjectId(category);

        const products = await Product.find(query)
        .select("name price imgUrl category")
        .populate("category", "name")
        .lean()
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .maxTimeMS(5000);

        console.log("Fetched products:", products);
        res.status(200).json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

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

        // Handle image upload if provided
        if (req.file) {
        const uploadsDir = path.join(__dirname, "../public/uploads/products");
        await fsPromises.mkdir(uploadsDir, { recursive: true });

        const fileName = `${newProduct._id}${path.extname(req.file.originalname)}`;
        const filePath = path.join(uploadsDir, fileName);

        await fsPromises.writeFile(filePath, req.file.buffer);
        newProduct.imgUrl = `/uploads/products/${fileName}`;
        await newProduct.save();
        }

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Failed to save product" });
    }
};