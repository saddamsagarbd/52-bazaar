import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/cartActions';
import { Table, Button, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart);

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const columns = [
        {
        title: 'Product',
        dataIndex: 'product',
        key: 'product',
        render: (product) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                src={product.image || product.imgUrl}
                alt={product.name || product.title}
                style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 10 }}
            />
            <span>{product.name || product.title}</span>
            </div>
        )
        },
        {
        title: 'Price',
        dataIndex: 'product',
        key: 'price',
        render: (product) => `৳${product.price}`
        },
        {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity'
        },
        {
        title: 'Total',
        key: 'total',
        render: (_, record) => `৳${record.product.price * record.quantity}`
        },
        {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Button danger onClick={() => handleRemove(record.product._id)}>
            Remove
            </Button>
        )
        }
    ];

    if (!cart.items.length) {
        return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <Title level={3}>Your cart is empty</Title>
            <Link to="/products">
            <Button type="primary">Browse Products</Button>
            </Link>
        </div>
        );
    }

    return (
        <div style={{ padding: '30px' }}>
        <Title level={2}>Your Cart</Title>
        <Table
            columns={columns}
            dataSource={cart.items.map(item => ({ ...item, key: item.product._id }))}
            pagination={false}
        />
        <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Title level={4}>Total: ৳{cart.total}</Title>
            <Button type="primary" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
            </Button>
        </div>
        </div>
    );
};

export default CartPage;
