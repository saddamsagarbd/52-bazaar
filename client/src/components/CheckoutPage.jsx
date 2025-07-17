import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Form, Input, Button, Typography, Card, Divider, Radio, Alert, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PhoneOutlined, MailOutlined, HomeOutlined, CreditCardOutlined, DollarOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { 
        cart, 
        cartCount,
        subtotal, 
        vat, 
        deliveryCharge, 
        grandTotal,
        clearCart
    } = useCart();
    
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Prepare the order data
            const orderData = {
                customerInfo: values,  // Form values (name, email, etc.)
                paymentMethod,          // Selected payment method
                items: cart.map(item => ({  // Transform cart items
                    productId: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                total: grandTotal,
                timestamp: new Date().toISOString()
            };

            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${apiUrl}/api/place-order`, orderData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            });

            if (response.data.success) {
                clearCart();
                navigate('/order-success', { state: { orderId: response.data.orderId } });
            } else {
                throw new Error(response.data.message || 'Order failed');
            }
        } catch (error) {
            console.error('Checkout error:', {
                message: error.message,
                response: error.response?.data,
                stack: error.stack
            });
        } finally {
            setLoading(false);
        }
    };

    console.table(cart);

    if (!cart.length) {
        return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
            <Title level={3} className="mb-4">Your cart is empty</Title>
            <Button type="primary" onClick={() => navigate('/')}>
            Browse Products
            </Button>
        </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <Title level={2} className="mb-6">Checkout</Title>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Delivery Information */}
            <div className="lg:col-span-2 space-y-6">
            <Card title="Delivery Information" className="shadow-sm">
                <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    phone: '',
                    address: '',
                    notes: ''
                }}
                >
                <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                >
                    <Input size="large" placeholder="John Doe" />
                </Form.Item>
                
                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                    { required: true, message: 'Please enter your phone number' },
                    { pattern: /^[0-9]{11}$/, message: 'Please enter a valid 11-digit number' }
                    ]}
                >
                    <Input 
                    size="large" 
                    prefix={<PhoneOutlined />} 
                    placeholder="01XXXXXXXXX" 
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter your email address' },
                        { type: 'email', message: 'Please enter a valid email address' }
                    ]}
                >
                    <Input
                        size="large"
                        prefix={<MailOutlined />}
                        placeholder="example@email.com"
                    />
                </Form.Item>

                <Form.Item
                    name="street"
                    label="Street Address"
                    rules={[
                        { required: true, message: 'Please enter street address' }
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="House, Road, or Area"
                    />
                </Form.Item>

                <Form.Item
                    name="city"
                    label="City"
                    rules={[
                        { required: true, message: 'Please enter city name' }
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="Enter city name"
                    />
                </Form.Item>

                <Form.Item
                    name="additionalInfo"
                    label="Additional Information"
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Landmark, special instructions (optional)"
                    />
                </Form.Item>

                <Form.Item name="isDefault" valuePropName="checked" initialValue={true}>
                    <Checkbox>Set as Default Address</Checkbox>
                </Form.Item>

                {/* <Form.Item
                    name="address"
                    label="Delivery Address"
                    rules={[{ required: true, message: 'Please enter your address' }]}
                >
                    <TextArea 
                    rows={4} 
                    size="large" 
                    prefix={<HomeOutlined />} 
                    placeholder="House #, Road #, Area, City" 
                    />
                </Form.Item> */}
                
                <Form.Item
                    name="notes"
                    label="Order Notes (Optional)"
                >
                    <TextArea 
                    rows={2} 
                    size="large" 
                    placeholder="Special instructions, delivery preferences, etc." 
                    />
                </Form.Item>
                
                <Divider className="my-6" />
                
                <Title level={4} className="mb-4">Payment Method</Title>
                
                <Form.Item name="paymentMethod" initialValue="cash_on_delivery">
                    <Radio.Group 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full"
                    >
                    <div className="space-y-3">
                        <Radio value="cod" className="block w-full">
                            <div className="flex items-center p-3 border rounded hover:border-blue-400">
                                <DollarOutlined className="text-xl mr-3" />
                                <div>
                                <Text strong className="block">Cash on Delivery</Text>
                                <Text type="secondary">Pay when you receive your order</Text>
                                </div>
                            </div>
                        </Radio>
                        
                        <Radio value="bkash" className="block w-full">
                            <div className="flex items-center p-3 border rounded hover:border-blue-400">
                                <CreditCardOutlined className="text-xl mr-3" />
                                <div>
                                <Text strong className="block">bKash Payment</Text>
                                <Text type="secondary">Pay instantly via bKash</Text>
                                </div>
                            </div>
                        </Radio>
                    </div>
                    </Radio.Group>
                </Form.Item>
                
                {paymentMethod === 'bkash' && (
                    <Form.Item
                    name="bkashNumber"
                    label="bKash Phone Number"
                    rules={[
                        { required: true, message: 'Please enter your bKash number' },
                        { pattern: /^[0-9]{11}$/, message: 'Please enter a valid 11-digit number' }
                    ]}
                    className="mt-4"
                    >
                    <Input 
                        size="large" 
                        prefix={<PhoneOutlined />} 
                        placeholder="01XXXXXXXXX" 
                    />
                    </Form.Item>
                )}
                </Form>
            </Card>
            </div>
            
            {/* Right Column - Order Summary */}
            <div>
            <Card title={`Order Summary (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`} className="shadow-sm sticky top-4">
                <div className="space-y-3">
                {cart.map(item => (
                    <div key={item.product._id} className="flex justify-between">
                    <Text>
                        {item.product.name} × {item.quantity}
                    </Text>
                    <Text>৳{(item.product.price * item.quantity).toFixed(2)}</Text>
                    </div>
                ))}
                
                <Divider className="my-3" />
                
                <div className="space-y-2">
                    <div className="flex justify-between">
                    <Text>Subtotal:</Text>
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
                    
                    <div className="flex justify-between text-lg font-bold">
                    <Text>Total:</Text>
                    <Text>৳{grandTotal.toFixed(2)}</Text>
                    </div>
                </div>
                
                <Button 
                    type="primary" 
                    size="large" 
                    block 
                    loading={loading}
                    onClick={() => form.submit()}
                    className="mt-6 h-12"
                >
                    Place Order
                </Button>
                
                <Alert
                    message="Secure Checkout"
                    description="Your personal information is protected"
                    type="info"
                    showIcon
                    className="mt-4"
                />
                </div>
            </Card>
            </div>
        </div>
        </div>
    );
};

export default CheckoutPage;