const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});



// ✅ Optimized Indexes
categorySchema.index({ name: 1 }); // Improves text-based category lookups
categorySchema.index({ parent_id: 1 }); // Efficient subcategory retrieval
categorySchema.index({ is_active: 1, parent_id: 1 }); // Fast filtering for active subcategories

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
