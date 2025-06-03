const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be a positive number'],
  },
  imgUrl: {
    type: String,
    default: null,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

productSchema.index({ is_active: 1, category: 1 }); // Helps filter by category & active status
productSchema.index({ price: 1 }); // Improves price-based sorting & queries
productSchema.index({ name: "text" }); // Enables fast full-text search on product names

require('./categoryModel');
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
