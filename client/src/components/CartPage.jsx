import React from 'react';
import { Table, Button, Typography, InputNumber, Divider, Card, Row, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CartPage = () => {
    const navigate = useNavigate();
    const { 
        cart, 
        updateQuantity, 
        removeFromCart, 
        subtotal, 
        vat, 
        deliveryCharge, 
        grandTotal,
        cartCount
    } = useCart();

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
            dataIndex: 'product',
            key: 'product',
            render: (_, record) => (
                <div className="flex items-center">
                    <img
                        src={record.product.imgUrl}
                        alt={record.product.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div>
                        <Text strong className="block">{record.product.name}</Text>
                        <Text type="secondary" className="text-xs">SKU: {record.product.sku || 'N/A'}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => <Text strong>৳{record.product.price.toFixed(2)}</Text>,
            align: 'right'
        },
        {
            title: 'Quantity',
            key: 'quantity',
            render: (_, record) => (
                console.log("item:", record),
                <InputNumber
                    min={1}
                    max={record.product.quantity}
                    value={record.quantity}
                    onChange={(value) => updateQuantity(record.product._id, value)}
                    className="w-20"
                />
            ),
            align: 'center'
        },
        {
            title: 'Total',
            key: 'total',
            render: (_, record) => <Text strong>৳{(record.product.price * record.quantity).toFixed(2)}</Text>,
            align: 'right'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleRemove(record.product._id)}
                    className="flex items-center"
                >
                    Remove
                </Button>
            ),
            align: 'center'
        },
    ];

    if (!cart.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <ShoppingCartOutlined className="text-5xl text-gray-400 mb-4" />
                <Title level={3} className="mb-4">Your shopping cart is empty</Title>
                <Text type="secondary" className="mb-6">You haven't added any products to your cart yet.</Text>
                <Link to="/products">
                    <Button type="primary" size="large">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Title level={2} className="mb-6">
                Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card className="shadow-sm">
                        <div className="overflow-x-auto">
                            <Table
                                columns={columns}
                                dataSource={cart.map(item => ({ ...item, key: item.product._id }))}
                                pagination={false}
                                bordered={false}
                                className="cart-table"
                                scroll={{ x: "max-content" }}
                            />
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Order Summary" className="shadow-sm lg:sticky lg:top-4">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Text>Subtotal ({cartCount} items):</Text>
                                <Text>৳{subtotal.toFixed(2)}</Text>
                            </div>

                            <div className="flex justify-between">
                                <Text>VAT (10%):</Text>
                                <Text>৳{vat.toFixed(2)}</Text>
                            </div>

                            <div className="flex justify-between">
                                <Text>Delivery Charge:</Text>
                                <Text>৳{deliveryCharge.toFixed(2)}</Text>
                            </div>

                            <Divider className="my-3" />

                            <div className="flex justify-between text-lg">
                                <Text strong>Total:</Text>
                                <Text strong>৳{grandTotal.toFixed(2)}</Text>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={() => navigate('/checkout')}
                                className="mt-4 h-12"
                            >
                                Proceed to Checkout
                            </Button>

                            <Link to="/" className="block mt-2">
                                <Button block size="large">Continue Shopping</Button>
                            </Link>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartPage;