import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DeleteForever, Edit } from "@mui/icons-material";
import usePageTitle from "../../hooks/usePageTitle";

const Categories = () => {
  usePageTitle("Categories");

  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "", parent: "" });
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const apiUrl = import.meta.env.VITE_API_URL;

  const closeModal = () => {
    setModalIsOpen(false);
    setNewCategory({ name: "", parent: "" });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.name.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No token found, user not authenticated");
      return;
    }

    const data = {
      name: newCategory.name.trim(),
      parent_id: newCategory.parent || null,
      is_active: true,
    };

    try {
      let apiUrl = import.meta.env.VITE_API_URL;

      const url = editCategory
        ? `${apiUrl}/api/category/edit/${editCategory._id}` // <-- PUT route
        : `${apiUrl}/api/category/store`; // <-- POST route

      const method = editCategory ? "put" : "post";

      console.time("Request send");

      const response = await axios({
        method,
        url,
        data,
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Uploading: ${percent}%`);
        },
      });

      console.timeEnd("Response time");

      // Validate response structure
      if (!response?.status) {
        throw new Error(response.message || "Invalid response from server");
      }

      // Success handling
      if (response.data.success) {
        toast.success(
          editCategory
            ? "Category updated successfully"
            : "Category added successfully"
        );
        closeModal();
        await fetchCategories(apiUrl);
        setEditCategory(null);
      }
    } catch (err) {
      // Enhanced error messages
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to add category";

      toast.error(errorMessage);
    }
  };

  const handleDelete = useCallback((id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove the category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${apiUrl}/api/category/${id}/deactivate`)
          .then((res) => {
            if (res.data.success) {
              toast.success(res.data.message);
              // remove from UI
              setCategories((prev) => prev.filter((cat) => cat._id !== id));
            } else {
              toast.error(res.data.message || "Something went wrong.");
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error("Failed to remove the category.");
          });
      }
    });
  }, []);

  const handleModify = useCallback(
    (id) => {
      if (!categories?.length) {
        console.warn("No categories loaded");
        return;
      }

      const category = categories.find((p) => String(p._id) === String(id));

      if (!category) {
        console.warn("Category not found for id:", id);
        return;
      }

      setEditCategory(category);

      setNewCategory({
        ...category,
        parent:
          typeof category.parent_id === "object"
            ? category.parent_id?._id ?? ""
            : category.parent_id ?? "",
      });

      setModalIsOpen(true);
    },
    [categories]
  );

  const columns = useMemo(
    () => [
      {
        header: "Category Name",
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
        header: "Parent Category",
        accessorKey: "parent_id",
        cell: ({ getValue }) => {
          const parent_id = getValue();
          return parent_id?.name || "N/A";
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const id = row.original._id;

          return (
            <div className="flex items-center gap-2">
              <button
                disabled={loading || categories.length === 0}
                onClick={() => handleModify(id)}
                className="text-primary-500 hover:text-primary-700 cursor-pointer"
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
    [categories, loading, handleDelete, handleModify]
  );

  const filteredData = useMemo(() => {
    return categories.filter((category) =>
      `${category.name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

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

  const fetchCategories = async (page = 1, limit = pageSize) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const safePage = Number(page);
      const safeLimit = Number(limit);

      const url = `${apiUrl}/api/categories?page=${safePage}&limit=${safeLimit}`;

      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
        setPageCount(response.data.totalPages);
      } else {
        console.error("Unexpected response format:", response.data.categories);
      }
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(pageIndex + 1, pageSize);
  }, [pageIndex, pageSize]);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-dashed rounded-lg mt-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <Dialog open={modalIsOpen} onOpenChange={setModalIsOpen}>
            <DialogTrigger asChild>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Add Category
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddCategory} className="space-y-4 mt-2">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  required
                />

                <select
                  value={newCategory.parent}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, parent: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                >
                  <option value="">Parent Category (optional)</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setModalIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                  >
                    Add
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3.536-3.536A9.98 9.98 0 002 12h2z"
                        ></path>
                      </svg>
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
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
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong>{" "}
              of <strong>{table.getPageCount()}</strong>
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="text-sm border rounded-md px-2 py-1"
            >
              {[5, 10, 20].map((size) => (
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
              {">>"}
            </button>
          </div>
        </div>

        {/* Add Category Modal */}
        {/* <Modal
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
                </Modal> */}
      </div>
    </div>
  );
};

export default Categories;
