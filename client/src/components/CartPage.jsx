import React from 'react';
import { Table, Button, Typography, InputNumber } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const { Title } = Typography;

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

    const handleRemove = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to undo this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                removeFromCart(id);
                toast.success("Item removed from cart");
            }
        });
    }

    const columns = [
        {
            title: 'Product',
            key: 'product',
            render: (_, record) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                src={record.product.imgUrl}
                alt={record.product.name || record.product.title}
                style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 10 }}
                />
                <span>{record.product.name || record.product.title}</span>
            </div>
            ),
        },
        {
            title: 'Price',
            key: 'price',
            render: (_, record) => `৳${record.product.price}`,
        },
        {
            title: 'Quantity',
            key: 'quantity',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity || 1}
                    onChange={(value) => updateQuantity(record.product._id, value)}
                    style={{ width: 80 }}
                />
            ),
        },
        {
            title: 'Total',
            key: 'total',
            render: (_, record) =>
            `৳${record.product.price * record.quantity}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
            <Button danger onClick={() => handleRemove(record.product._id)}>
                Remove
            </Button>
            ),
        },
    ];


    if (!cart.length) {
        return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <Title level={3}>Your cart is empty</Title>
            <Link to="/">
            <Button type="primary">Browse Products</Button>
            </Link>
        </div>
        );
    }

    return (
        <>
            <div className="flex flex-col justify-center bg-[transparent] w-full items-center">
                <div className="flex justify-center w-full max-w-[990px] mx-auto">
                    <div className="p-6">

                        <Table
                            columns={columns}
                            dataSource={cart.map(item => ({ ...item, key: item._id }))}
                            pagination={false}
                        />
                        <div style={{ textAlign: 'right', marginTop: 20 }}>
                            <Title level={4}>Total: ৳{cartTotal}</Title>
                            <Button type="primary" onClick={() => navigate('/checkout')}>
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
