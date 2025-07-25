import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import usePageTitle from "../../hooks/usePageTitle";
import { DeleteForever, Edit } from "@mui/icons-material";

const Products = () => {
  usePageTitle("Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    unit: "",
    quantity: "",
    product_image: null,
    category: "",
  });
  const [products, setProducts] = useState([]);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);

  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, product_image: file });
      setPreview(URL.createObjectURL(file)); // Preview
    }
  };

  const handleDelete = useCallback((id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmDelete) {
      setProducts((prev) => prev.filter((product) => product._id !== id));
    }
  }, []);
  const handleModify = useCallback(
    (id) => {
      if (!products || products.length === 0) {
        console.warn("No products loaded");
        return;
      }

      const product = products.find((p) => String(p._id) === String(id));

      if (!product) {
        console.warn("Product not found for id:", id);
        return;
      }

      setEditProduct(product);
      setNewProduct({
        ...product,
        category:
          typeof product.category === "object"
            ? product.category._id
            : product.category,
      });
      setPreview(product.imgUrl); // if you're previewing existing image
      setModalIsOpen(true);
    },
    [products]
  );

  const columns = useMemo(
    () => [
      {
        header: "Product",
        accessorKey: "name",
        cell: ({ row }) => {
          const name = row.original.name;
          const imgUrl = row.original.imgUrl; // Adjust key based on your actual field

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
        header: "Category",
        accessorKey: "category",
        cell: ({ getValue }) => {
          const category = getValue();
          return category?.name || "N/A";
        },
      },
      {
        header: "Price",
        accessorKey: "price",
      },
      {
        header: "Unit",
        accessorKey: "unit",
      },
      {
        header: "Available Qty",
        accessorKey: "quantity",
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const id = row.original._id;

          return (
            <div className="flex items-center gap-2">
              <button
                disabled={loading || products.length === 0}
                onClick={() => handleModify(id)}
                className="text-primary-500 hover:text-primary-700"
                title="Edit"
              >
                <Edit style={{ color: "skyblue" }} />
              </button>

              <button
                onClick={() => handleDelete(id)}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <DeleteForever />
              </button>
            </div>
          );
        },
      },
    ],
    [products, loading, handleDelete, handleModify]
  );

  const filteredData = useMemo(
    () =>
      products.filter((product) =>
        [product.name, product.price]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [products, searchQuery]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount, // total pages from backend
    manualPagination: true, // tell react-table to NOT paginate data internally
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const closeModal = () => {
    setModalIsOpen(false);
    setNewProduct({ name: "", price: "" });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name.trim()) return;

    const priceNum = Number(newProduct.price);
    if (isNaN(priceNum) || priceNum <= 0) return;

    if (!newProduct.unit.trim()) return;

    const quantityNum = Number(newProduct.quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) return;

    if (!newProduct.category.trim()) return;

    const formData = new FormData();

    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("unit", newProduct.unit);
    formData.append("quantity", newProduct.quantity);

    if (newProduct.product_image) {
      formData.append("product_image", newProduct.product_image);
    }

    try {
      let apiUrl = import.meta.env.VITE_API_URL;

      const url = editProduct
        ? `${apiUrl}/api/product/${editProduct._id}` // <-- PUT route
        : `${apiUrl}/api/add-product`; // <-- POST route

      const method = editProduct ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        timeout: 10000,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          editProduct
            ? "Product updated successfully"
            : "Product added successfully"
        );
        closeModal();
        await fetchProducts(apiUrl);
        setEditProduct(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const fetchCategories = async (apiUrl) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${apiUrl}/api/categories`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCategories(response.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProducts = async (page = 1, limit = pageSize) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    setLoading(true);

    try {

      const safePage = Number(page);
      const safeLimit = Number(limit);


      // const url = `${apiUrl}/api/products`;
      const url = `${apiUrl}/api/products?page=${safePage}&limit=${safeLimit}`;

      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const productsList =
        response.data.products || response.data?.data?.products || [];

      if (Array.isArray(productsList)) {
        setProducts(productsList);
        setPageCount(response.data.totalPages);
      } else {
        console.error("Unexpected response format:", response.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!apiUrl) return;
    fetchCategories(apiUrl);
    fetchProducts(pageIndex + 1, pageSize);
  }, [pageIndex, pageSize]);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-dashed rounded-lg mt-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Product</h2>
          <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => {
                  setNewProduct({
                    name: "",
                    price: "",
                    unit: "pcs",
                    quantity: "",
                    category: "",
                    product_image: null,
                  });
                  setPreview(null);
                  setEditProduct(null); // reset edit mode
                  setModalIsOpen(true);
                }}
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
                    value={newProduct.name || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (BDT)
                  </label>
                  <input
                    type="text"
                    value={newProduct.price || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave empty for root Product"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit(s)
                  </label>
                  <select
                    value={newProduct.unit || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, unit: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="pcs">Pcs</option>
                    <option value="kg">KG</option>
                    <option value="grm">Gram</option>
                    <option value="ltr">Litre</option>
                    <option value="box">Box/Packet</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newProduct.quantity || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        quantity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newProduct.category || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value,
                      })
                    }
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
                <DialogFooter>
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
                    {editProduct ? "Update Product" : "Add Product"}
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between mb-4 w-full">
          <div className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product..."
              className="px-4 py-2 border rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={pageSize === 0 ? "all" : pageSize}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "all") {
                  setPageSize(0); // fetch all from API if needed
                } else {
                  setPageSize(Number(value));
                }
                setPageIndex(0);
              }}
              className="text-sm border rounded-md px-2 py-1"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
              <option value="all">Show All</option>
            </select>
          </div>
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
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
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
              {"<<"}
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
              Page{" "}
              <strong>
                {(table.getState().pagination.pageIndex ?? 0) + 1}
              </strong>{" "}
              of <strong>{table.getPageCount() || 1}</strong>
            </span>
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
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
