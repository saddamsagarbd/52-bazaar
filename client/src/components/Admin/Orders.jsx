import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';

import usePageTitle from "../../hooks/usePageTitle";
import { Details } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

export default function Orders(){
    usePageTitle("Orders");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleModify = useCallback((id) => {
        navigate(`/admin/orders/${id}`);
    }, [navigate]);

    const columns = useMemo(
        () => [
            {
                header: 'Order ID',
                accessorKey: '_id',
            },
            {
                header: 'Customer Name',
                accessorKey: 'customer_name',
            },
            {
                header: 'Payment Method',
                accessorKey: 'payment_method',
            },
            {
                header: 'Shipping Address',
                accessorKey: 'shipping_address',
            },
            {
                header: 'Actions',
                cell: ({ row }) => {
                    const id = row.original._id;

                    return (
                        <button
                            onClick={() => handleModify(id)}
                            className="text-primary-500 hover:text-primary-700"
                            title="Details"
                        >
                            <Details style={{ color: "skyblue" }} />
                        </button>
                    );
                },
            },
        ],
        [handleModify]
    );


    const filteredData = useMemo(() => 
        orders.filter((order) =>
        [order._id]
            .join(' ')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ),
        [orders, searchQuery]
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    const fetchOrders = async (apiUrl) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setLoading(true);

        try {
            const url = `${apiUrl}/api/orders`;
            const response = await axios.get(url, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const ordersList = response.data.orders || [];

            if (Array.isArray(ordersList)) {
                const formattedOrders = ordersList.map((order) => ({
                    _id: order.order_id || order._id,
                    customer_name: order.customer_name || order.user?.name || order.shippingAddress?.name,
                    payment_method: order.payment_method || order.paymentMethod,
                    shipping_address: order.shipping_address,
                }));
                setOrders(formattedOrders);
            } else {
                console.error("Unexpected response format:", response.data.orders);
            }
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!apiUrl) return;
        fetchOrders(apiUrl);
    }, [apiUrl]);

    return(

        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-dashed rounded-lg mt-14">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Customer Orders</h2>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search order..."
                        className="px-4 py-2 border rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th 
                                            key={header.id} 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        {row.getVisibleCells().map((cell) => (
                                            <td 
                                                key={cell.id} 
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 px-2">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                        >
                            {'<<'}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                        >
                            Previous
                        </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <span className="text-sm">
                            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
                            <strong>{table.getPageCount()}</strong>
                        </span>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => table.setPageSize(Number(e.target.value))}
                            className="text-sm border rounded-md px-2 py-1"
                        >
                            {[5, 10, 20].map(size => (
                                <option key={size} value={size}>
                                    Show {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex space-x-2">
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                        >
                            Next
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                        >
                            {'>>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}