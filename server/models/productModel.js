import mongoose from 'mongoose';
import './categoryModel.js';

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
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be a positive number'],
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
  imgUrl: {
    type: String,
    default: null,
    trim: true,
  },
  imgPublicId: {
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

productSchema.index({ is_active: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: "text" }); // Enables full-text search on product names

const Product = mongoose.model('Product', productSchema);

export default Product;
