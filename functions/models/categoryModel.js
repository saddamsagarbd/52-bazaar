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

categorySchema.index({ is_active: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
// module.exports = (conn)=> {
//   return conn.model('Category', categorySchema, 'categories');
// };
