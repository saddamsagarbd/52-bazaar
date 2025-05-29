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
        trim: true,
      },
      imgUrl: {
        type: String,
        required: false,
        trim: true,
        default: null,
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

module.exports = (conn) => {
  require('./categoryModel')(conn); 
  return conn.model('Product', productSchema);
}
