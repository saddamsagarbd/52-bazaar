const { Types } = require('mongoose');
const { connA } = require('../db-config/db-conn');
const CategoryModel = require('../models/categoryModel');
const Category = CategoryModel(connA);

exports.getCategories = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    try {
        const { name, parent } = req.query;

        const query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (parent && Types.ObjectId.isValid(parent)) {
            query.parent_id = Types.ObjectId(parent);
        } else if (parent) {
            return res.status(400).json({ message: 'Invalid parent ID format' });
        }

        const categories = await Category.find(query).populate('parent_id', 'name').sort({ created_at: -1 });

        console.log('Categories found:', categories);

        res.json(categories);
        
    } catch (err) {
        // Log the actual error message and stack trace
        console.error('Error fetching categories:', err.message);
        console.error(err.stack);

        // Send server error response
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


exports.addCategory = async (req, res) => {

    console.table(req.body);
    
    try {
        const { name, parent_id, is_active } = req.body;

        // Check for existing product with same name and category
        const existingCategory = await Category.findOne({ 
            name: name.trim(), 
            parent_id 
        });

        if(existingCategory){
            return res.status(400).json({ 
                success: false, 
                message: "Category with the same name already exists" 
            });
        }

        const newCategory = new Category({
            name,
            parent_id: parent_id || null,
            is_active: is_active ?? true,
            created_at: new Date(),
            updated_at: new Date(),
        });

        const saved = await newCategory.save();

        res.status(201).json({"status" : saved, "message" : "Category added successfully"});
    } catch (error) {
        console.error('Add Category Error:', error);
        res.status(500).json({ message: 'Failed to create category' });
    }
};
