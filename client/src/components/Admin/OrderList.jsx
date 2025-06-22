// components/OrderList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/order/my-orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setOrders(res.data));
    }, []);

    return (
        <div>
        <h2>Your Orders</h2>
        {orders.map(order => (
            <div key={order._id}>
            <p>Total: ৳{order.totalAmount}</p>
            <p>Status: {order.status}</p>
            <p>Payment: {order.paymentMethod}</p>
            </div>
        ))}
        </div>
    );
};

export default OrderList;
