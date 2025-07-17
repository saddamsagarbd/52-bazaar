import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const OrderSuccess = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Get orderId from location state
                const orderId = location.state?.orderId;
                if (!orderId) {
                    navigate('/'); // Redirect if no order reference
                    return;
                }

                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiUrl}/order-success/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error("Failed to load order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [location, navigate]);

    if (loading) {
        return <div className="text-center py-8">Loading confirmation...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p className="mb-6">Thank you for your purchase</p>
            
            {order && (
                <div className="mb-6 p-4 bg-gray-50 rounded">
                    <p>Order #: {order.orderId}</p>
                    <p>Total: ${order.total.toFixed(2)}</p>
                </div>
            )}

            <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition"
            >
                Continue Shopping
            </button>
        </div>
    );
};

export default OrderSuccess;