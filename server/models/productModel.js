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

// Indexes
productSchema.index({ is_active: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 1 }); // for regex search
productSchema.index({ is_active: 1, category: 1 }); // compound index

require('./categoryModel');
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
