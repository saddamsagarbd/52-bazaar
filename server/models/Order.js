import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
    totalAmount: Number,
    address: {
        name: String,
        phone: String,
        street: String,
        city: String
    },
    paymentMethod: { type: String, enum: ['cod', 'mfs'], required: true },
    status: { type: String, default: 'pending' }, // pending, confirmed, shipped, delivered
},
{
    timestamps: true, // Adds createdAt and updatedAt automatically
}
);

export default mongoose.model('Order', orderSchema);
