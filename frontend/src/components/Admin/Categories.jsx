import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import Modal from 'react-modal';
import usePageTitle from "../../hooks/usePageTitle";

// Initialize modal root (prevents freezing)
Modal.setAppElement('#root');

const Categories = () => {
    usePageTitle("Categories");

    const [searchQuery, setSearchQuery] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', parent: '' });
    const [categories, setCategories] = useState([]);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => {
        setModalIsOpen(false);
        setNewCategory({ name: '', parent: '' });
    };

    const handleAddCategory = async (e) => {

        e.preventDefault();

        if (!newCategory.name.trim()) return;
    
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.log("No token found, user not authenticated");
            return;
        }

        const formData = new FormData();
    
        formData.append("name", newCategory.name.trim());
        formData.append("parent_id", newCategory.parent || null);
        formData.append("is_active", true);
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/add-category`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
                timeout: 10000
            });

            // Validate response structure
            if (!response?.data?.success) {
                throw new Error(response.data.message || "Invalid response from server");
            }

            // Success handling
            toast.success("Category added successfully");
            closeModal();
            fetchCategories();
    
        } catch (err) {
            console.log('Category submission error:', err);
        
            // Enhanced error messages
            const errorMessage = err.response?.data?.message || 
                                err.message || 
                                "Failed to add category";
            
            toast.error(errorMessage);
        }
    };    

    const handleDelete = useCallback((id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            setCategories(prev => prev.filter(category => category.id !== id));
        }
    }, []);

    const columns = useMemo(() => [
        {
            header: 'Category Name',
            accessorKey: 'name',
            cell: info => info.getValue(),
        },
        {
            header: 'Parent Category',
            accessorKey: 'parent_id',
            cell: ({ getValue }) => {
                const parent_id = getValue();
                return parent_id?.name || 'N/A';
            },
        },
        {
            header: 'Actions',
            cell: ({ row }) => (
                <button
                    onClick={() => handleDelete(row.original.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                >
                    Delete
                </button>
            ),
        },
    ], [handleDelete]);

    const filteredData = useMemo(() => {
        return categories.filter((category) => `${category.name}`.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [categories, searchQuery]);
    

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

    const fetchCategories = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            console.log("Failed to fetch categories", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-dashed rounded-lg mt-14">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Categories</h2>
                    <button
                        onClick={openModal}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Add Category
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Categories..."
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
                                                {
                                                    flexRender(cell.column.columnDef.cell, cell.getContext())
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No categories found
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

                {/* Add Category Modal */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add Category"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                    portalClassName="modal-portal"
                    ariaHideApp={true}
                    shouldCloseOnOverlayClick={true}
                    shouldCloseOnEsc={true}
                    preventScroll={true}
                >
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Add Category</h2>
                                <button 
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <form onSubmit={handleAddCategory}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Parent Category
                                    </label>
                                    <select
                                        value={newCategory.parent}
                                        onChange={(e) => setNewCategory({...newCategory, parent: e.target.value})}
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        <option value="">-- None --</option>
                                        {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                            </option>
                                        ))
                                        ) : (
                                        <option disabled>No parent categories found</option>
                                        )}
                                    </select>
                                </div>
                                
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Add Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Categories;