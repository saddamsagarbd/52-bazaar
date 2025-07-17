import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Logo from '../../assets/images/52-bazaar-logo.png';

export default function OrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentStatus, setCurrentStatus] = useState('pending');

    // Print handler
    const handlePrint = () => {
        // Print only the invoice div
        const printContents = document.getElementById("invoice").innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        // window.location.reload(); // Reload to restore React state
    };

    // Status change handler (could call API)
    const handleStatusChange = async (newStatus) => {
        setCurrentStatus(newStatus);

        // Call API to update status if you want:
        // await updateOrderStatus(order._id, newStatus);
    };

    // Helper for status badge colors
    const statusColors = {
        pending: "bg-yellow-500",
        shipping: "bg-blue-500",
        delivered: "bg-green-600",
    };

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchOrderDetails = async (id, apiUrl) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/api/orders/${id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log(response.data);

            setOrder(response.data);
            handleStatusChange(response.data.status);
        } catch (err) {
            console.error("Failed to fetch order details", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails(id, apiUrl);
    }, [id, apiUrl]);

    if (loading) {
        return <p className="p-4">Loading...</p>;
    }

    if (!order) {
        return <p className="p-4">Order not found.</p>;
    }

    // Calculate subtotal
    const subtotal = order?.items?.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0) || 0;

    // Assuming delivery charge is fixed or part of order (if not present, use a default)
    const deliveryCharge = order.deliveryCharge ?? 60; // example: 60 ৳ fixed

    // VAT is 10% of subtotal
    const vat = subtotal * 0.10;

    // Grand total calculation
    const grandTotal = subtotal + deliveryCharge + vat;


    return (
        <div className="p-6 sm:ml-64">
            <div
                className="p-6 mt-14 bg-white shadow-md rounded-xl print:shadow-none print:p-4"
                id="invoice"
            >
                {/* ✅ Logo for Print - Top Center */}
                <div className="hidden print:block text-center mb-4">
                    <img
                    src={Logo}
                    alt="Company Logo"
                    className="h-20 mx-auto"
                    />
                    <h1 className="text-3xl font-bold text-gray-800">Your Company Name</h1>
                    <p className="text-gray-600 text-sm">
                    123 Business Street, Dhaka, Bangladesh
                    </p>
                    <p className="text-gray-600 text-sm">
                    Phone: +880 1234-567890 | Email: info@yourcompany.com
                    </p>
                    <hr className="my-3 border-gray-400" />
                </div>
                {/* ✅ Company Header */}
                <div className="flex justify-between items-center print:hidden">
                    <div className="flex items-center space-x-3">
                        <img
                            src={Logo}
                            alt="Company Logo"
                            className="h-12 w-auto"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                            Your Company Name
                            </h1>
                            <p className="text-gray-500 text-sm">
                            123 Business Street, Dhaka, Bangladesh
                            </p>
                            <p className="text-gray-500 text-sm">
                            Phone: +880 1234-567890 | Email: info@yourcompany.com
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                        <span className="text-sm text-gray-500">
                            Order Date: {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* ✅ Order Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                        <p>
                        <strong className="text-gray-600">Order ID:</strong>{" "}
                        <span className="text-gray-800">{order._id}</span>
                        </p>
                        <p>
                        <strong className="text-gray-600">Customer:</strong>{" "}
                        <span className="text-gray-800">{order.shippingAddress?.name}</span>
                        </p>
                        <p>
                        <strong className="text-gray-600">Contact:</strong>{" "}
                        <span className="text-gray-800">{order.shippingAddress?.phone}</span>
                        </p>
                        <p>
                        <strong className="text-gray-600">Shipping Address:</strong>{" "}
                        <span className="text-gray-800">
                            {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        </span>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p>
                        <strong className="text-gray-600">Payment Method:</strong>{" "}
                        <span
                            className={`px-2 py-1 rounded text-white text-sm ${
                            order.paymentMethod === "cod"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                        >
                            {order.paymentMethod.toUpperCase()}
                        </span>
                        </p>
                        <p className="print:hidden">
                        <strong className="text-gray-600">Status:</strong>{" "}
                        <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={`px-2 py-1 rounded text-white text-sm cursor-pointer ${
                            statusColors[currentStatus]
                            }`}
                        >
                            <option value="pending">Pending</option>
                            <option value="shipping">Shipping</option>
                            <option value="delivered">Delivered</option>
                        </select>
                        </p>
                        <p className="hidden print:block">
                        <strong className="text-gray-600">Status:</strong>{" "}
                        <span className="text-gray-800 capitalize">{currentStatus}</span>
                        </p>
                        <p>
                        <strong className="text-gray-600">Total Amount:</strong>{" "}
                        <span className="text-lg font-semibold text-green-600">
                            ৳{order.totalAmount}
                        </span>
                        </p>
                    </div>
                </div>

                {/* ✅ Products Table */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Products</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-600">Product</th>
                            <th className="px-4 py-3 text-left text-gray-600">Quantity</th>
                            <th className="px-4 py-3 text-left text-gray-600">Price</th>
                            <th className="px-4 py-3 text-left text-gray-600">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map((item, idx) => (
                            <tr
                            key={item._id}
                            className={`${
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } border-b`}
                            >
                            <td className="px-4 py-3 text-gray-700">
                                {item.product?.name || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                            <td className="px-4 py-3 text-gray-700">
                                ৳{item.priceAtPurchase}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                                ৳{item.quantity * item.priceAtPurchase}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* ✅ Total Summary */}
                <div className="mt-6 max-w-sm ml-auto bg-gray-50 p-4 rounded-lg shadow-inner">
                <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">Subtotal</span>
                    <span className="text-gray-900 font-semibold">
                    ৳{subtotal.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">Delivery Charge</span>
                    <span className="text-gray-900 font-semibold">
                    ৳{deliveryCharge.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">VAT (10%)</span>
                    <span className="text-gray-900 font-semibold">৳{vat.toFixed(2)}</span>
                </div>
                <hr className="my-2 border-gray-300" />
                <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Grand Total</span>
                    <span>৳{grandTotal.toFixed(2)}</span>
                </div>
                </div>
            </div>

            {/* ✅ Buttons (Hidden on Print) */}
            <div className="mt-6 space-x-2 print:hidden">
                <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                🖨️ Print Invoice
                </button>
                <button
                onClick={() => navigate("/admin/orders")}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                ← Back to Orders
                </button>
            </div>
        </div>
    );
}
