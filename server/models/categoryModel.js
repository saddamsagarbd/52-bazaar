import mongoose from 'mongoose';
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

categorySchema.index({ name: "text" });
categorySchema.index({ is_active: 1, parent_id: 1, created_at: -1 });
categorySchema.index({ name: 1, parent_id: 1, is_active: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
