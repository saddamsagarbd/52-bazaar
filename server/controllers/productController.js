import { Types } from "mongoose";
import path from "path";
import fs from "fs";
const fsPromises = fs.promises;
import Product from "../models/productModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const getProducts = async (req, res) => {
  try {
    let { name, price, category, page = 1, limit = 10 } = req.query;
    const query = { is_active: true };

    const isTextSearch = Boolean(name);

    if (limit === "all" || limit === 0) {
      limit = 0; // MongoDB: 0 means "no limit" (return all)
      page = 1;
    } else {
      limit = Number(limit);
      page = Number(page);
    }

    const skip = limit === 0 ? 0 : (page - 1) * limit;

    // Filters
    if (isTextSearch) {
      query.$text = { $search: name };
    }

    // if (name) query.name = { $regex: name, $options: "i" };
    if (price && !isNaN(price)) query.price = Number(price);
    if (category && Types.ObjectId.isValid(category))
      query.category = new Types.ObjectId(category);

    const projection = {
      name: 1,
      price: 1,
      unit: 1,
      quantity: 1,
      imgUrl: 1,
      category: 1,
      ...(isTextSearch && { score: { $meta: "textScore" } }),
    };

    const sort = isTextSearch ? { score: { $meta: "textScore" } } : { name: 1 };

    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .select(projection)
        .sort(sort)
        .populate("category", "name")
        .lean()
        .skip(skip)
        .limit(limit === 0 ? undefined : limit) // ✅ no limit if 0
        .maxTimeMS(5000),
    ]);

    res.status(200).json({
      totalProducts,
      totalPages: limit === 0 ? 1 : Math.ceil(totalProducts / limit), // ✅ prevent division by zero
      currentPage: Number(page),
      products,
    });
  } catch (err) {
    console.error("Full error in getProducts:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code, // MongoDB error code if available
    });
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

async function processProductImage(newProduct, file) {
  if (!file) return;

  try {
    // Upload to Cloudinary
    const result = await uploadToCloudinary(file.buffer, "products");

    // Save the secure URL to your database
    newProduct.imgUrl = result.secure_url;
    newProduct.imgPublicId = result.public_id;
    return await newProduct.save();
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
}

const addProduct = async (req, res) => {
  try {
    const { name, price, unit, quantity, category } = req.body;

    // Check if product already exists within the category
    const existingProduct = await Product.findOne({
      name: name.trim(),
      category,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with the same name already exists in this category",
      });
    }

    const newProduct = new Product({ name, price, unit, quantity, category });

    await newProduct.save();

    // Process image upload separately
    setImmediate(async () => {
      if (req.file) await processProductImage(newProduct, req.file);
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Failed to save product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, category, unit, quantity } = req.body;
    const productId = req.params.id;

    // Check for duplicate product name in same category (exclude self)
    const existingProduct = await Product.findOne({
      _id: { $ne: productId },
      name: name.trim(),
      category,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with the same name already exists in this category",
      });
    }

    // Find current product
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const updatedData = { name, price, category, unit, quantity };

    // If a new image is uploaded
    if (req.file) {
      // 1. Delete old image from Cloudinary
      if (product.imgPublicId) {
        await deleteFromCloudinary(product.imgPublicId);
      }

      // 2. Upload new image to Cloudinary
      const uploaded = await uploadToCloudinary(req.file.buffer, "products");

      updatedData.imgUrl = uploaded.secure_url;
      updatedData.imgPublicId = uploaded.public_id;
    }

    // 3. Update product in DB
    const updated = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update product" });
  }
};

export default { getProducts, addProduct, updateProduct };
