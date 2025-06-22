// components/CheckoutPage.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { placeOrder } from '../redux/orderActions';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const CheckoutPage = () => {
    const cart = useSelector(state => state.cart);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        paymentMethod: 'cod'
    });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleOrder = async () => {
        if (!auth.isAuthenticated) {
        message.error('Please login first');
        navigate('/login');
        return;
        }

        try {
        const orderData = {
            items: cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity
            })),
            totalAmount: cart.total,
            address: form,
            paymentMethod: form.paymentMethod
        };

        await dispatch(placeOrder(orderData));
        message.success('Order placed!');
        navigate('/my-orders');
        } catch (err) {
        message.error('Failed to place order');
        }
    };

    return (
        <div>
        <h2>Checkout</h2>
        <input name="name" placeholder="Your Name" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="street" placeholder="Street" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <select name="paymentMethod" onChange={handleChange}>
            <option value="cod">Cash on Delivery</option>
            <option value="mfs">Mobile Payment</option>
        </select>
        <button onClick={handleOrder}>Place Order</button>
        </div>
    );
};

export default CheckoutPage;
