// routes/order.js
import express from 'express';
const router = express.Router();
import Order from '../models/Order.js';
import authMiddleware from '../middleware/authMiddleware.js'; // validate token

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { items, totalAmount, address, paymentMethod } = req.body;
        const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        address,
        paymentMethod
        });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ error: 'Order creation failed' });
    }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
});

export default router;
