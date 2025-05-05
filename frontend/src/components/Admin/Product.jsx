import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import Modal from 'react-modal';

// Sample data (Replace with real data or fetch from an API)
const data = [
    { id: 1, name: "Product 1", price: "$10" },
    { id: 2, name: "Product 2", price: "$20" },
    { id: 3, name: "Product 3", price: "$30" },
];

const columns = [
    { Header: "Product Name", accessor: "name" },
    { Header: "Price", accessor: "price" },
    { Header: "Actions", accessor: "actions", Cell: ({ row }) => (
        <button className="text-sm text-red-500 hover:text-red-700" onClick={() => console.log(row.original.id)}>
        Delete
        </button>
    )}
];

const Products = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');


    const filteredData = data.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.price.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { pageIndex, pageSize },
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        gotoPage,
        pageCount
    } = useTable(
        {
            columns,
            data: filteredData,
            initialState: { pageIndex: 0 }
        },
        usePagination
    );

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <>
        
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Products</h2>
                        <button
                        onClick={openModal}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                        Add Product
                        </button>
                    </div>

                    {/* Real-time Search Input */}
                    <div className="mb-6 flex items-center space-x-2">
                        <input
                        type="text"
                        placeholder="Search Products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full table-auto" {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="px-4 py-2 text-left border-b">
                                    {column.render('Header')}
                                </th>
                                ))}
                            </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} className="px-4 py-2 border-b">
                                    {cell.render('Cell')}
                                    </td>
                                ))}
                                </tr>
                            );
                            })}
                        </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                        className="px-3 py-1 border rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                        {"<<"}
                        </button>
                        <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className="px-3 py-1 border rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                        Previous
                        </button>
                        <span className="text-sm">
                        Page <strong>{pageIndex + 1} of {pageCount}</strong>
                        </span>
                        <button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className="px-3 py-1 border rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                        Next
                        </button>
                        <button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                        className="px-3 py-1 border rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                        {">>"}
                        </button>
                    </div>

                    {/* Add Product Modal */}
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Add Product"
                        className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-40"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
                        <form>
                            <div className="mb-4">
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                id="productName"
                                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            </div>
                            <div className="mb-4">
                            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="text"
                                id="productPrice"
                                className="mt-1 px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            </div>
                            <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add Product
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-gray-600 px-4 py-2 border rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            </div>
                        </form>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default Products;
