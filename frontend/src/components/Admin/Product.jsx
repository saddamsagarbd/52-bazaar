import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import usePageTitle from "../../hooks/usePageTitle";


const Products = () => {
    usePageTitle("Products");
    const [searchQuery, setSearchQuery] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', product_image: null, category: '' });
    const [products, setProducts] = useState([]);
    const [preview, setPreview] = useState(null);
    const [categories, setCategories] = useState([]);
    
    const folderUrl = import.meta.env.VITE_API_URL_FILE_LOCATION;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProduct({ ...newProduct, product_image: file });
            setPreview(URL.createObjectURL(file)); // Preview
        }
    };

    const columns = useMemo(
        () => [
            {
                header: 'Product',
                accessorKey: 'name',
                cell: ({ row }) => {
                    const name = row.original.name;
                    const imgUrl = `${folderUrl}`+row.original.imgUrl; // Adjust key based on your actual field

                    return (
                        <div className="flex items-center space-x-3">
                            {imgUrl && (
                                <img
                                    src={imgUrl}
                                    alt={name}
                                    className="w-10 h-10 rounded object-cover"
                                />
                            )}
                            <span>{name}</span>
                        </div>
                    );
                },
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: ({ getValue }) => {
                    const category = getValue();
                    return category?.name || 'N/A';
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
            },
            {
                header: 'Actions',
                cell: ({ row }) => (
                    <button
                        onClick={() => console.log('Delete', row.original.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                ),
            },
        ],
        []
    );

    const filteredData = useMemo(() => 
        products.filter((product) =>
        [product.name, product.price]
            .join(' ')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ),
        [products, searchQuery]
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

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => {
        setModalIsOpen(false);
        setNewProduct({ name: '', price: '' });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name.trim()) return;
        if (!newProduct.price.trim()) return;
        if (!newProduct.category.trim()) return;

        const formData = new FormData();

        formData.append("name", newProduct.name);
        formData.append("price", newProduct.price);
        formData.append("category", newProduct.category);
        formData.append("product_image", newProduct.product_image);

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${apiUrl}/add-product`, formData, {
                timeout: 15000,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.success) {
                toast.success("Product added successfully");
                closeModal();
                fetchProducts();
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const fetchCategories = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${apiUrl}/categories`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.data;
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${apiUrl}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.data;
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);
  

  return (
    <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-dashed rounded-lg mt-14">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Categories</h2>
                {/* <button
                    onClick={openModal}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Add Product
                </button> */}
                <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
                    <DialogTrigger asChild>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Add Product
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleAddProduct} className="space-y-4 mt-2">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price (ID)
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Leave empty for root Product"
                                />
                            </div>
                        
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
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
                                    <option disabled>No categories found</option>
                                    )}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-4 h-32 object-cover rounded"
                                    />
                                )}
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
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search product..."
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

            {/* Add Product Modal */}
            {/* <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Add Product"
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
                            <h2 className="text-xl font-semibold">Add Product</h2>
                            <button 
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddProduct}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price (ID)
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Leave empty for root Product"
                                />
                            </div>
                        
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
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
                                    <option disabled>No categories found</option>
                                    )}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-4 h-32 object-cover rounded"
                                    />
                                )}
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
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal> */}
        </div>
    </div>
  );
};

export default Products;