import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table';
import Modal from 'react-modal';
import usePageTitle from "../../hooks/usePageTitle";

// Initialize modal root (prevents freezing)
Modal.setAppElement('#root');

const defaultData = [];

const Categories = () => {
    usePageTitle("Categories");

    const [data, setData] = useState(defaultData);
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
            console.error("No token found, user not authenticated");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/add-category`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newCategory.name.trim(),
                    parent_id: newCategory.parent.trim() || null,
                    is_active: true
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add category');
            }
    
            const savedCategory = await response.json();
    
            // Optionally append to local UI state
            setData(prev => [...prev, savedCategory]);
            closeModal();
    
        } catch (err) {
            console.error('Error adding category:', err.message);
        }
    };    

    const handleDelete = useCallback((id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            setData(prev => prev.filter(category => category.id !== id));
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
            accessorKey: 'parent',
            cell: ({ row }) => {
                const parentId = row.original.parent;
                if (!parentId) return '-';
                const parent = data.find(cat => cat.id.toString() === parentId);
                return parent ? parent.name : 'Invalid Parent';
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
    ], [data, handleDelete]);

    // const filteredData = useMemo(() => 
    //     data.filter(cat => 
    //         `${cat.name} ${cat.parent}`.toLowerCase().includes(searchQuery.toLowerCase())
    //     ),
    //     [data, searchQuery]
    // );

    const table = useReactTable({
        data: categories,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found, user not authenticated");
            return; // Optionally handle the case where the token is missing
        }

        fetch(`${process.env.REACT_APP_API_URL}/categories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Attach token here
                'Content-Type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error('Error fetching categories:', err));

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
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                                        Parent Category (ID)
                                    </label>
                                    <select
                                        value={newCategory.parent}
                                        onChange={(e) => setNewCategory({...newCategory, parent: e.target.value})}
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        <option value="">-- None --</option>
                                        {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
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