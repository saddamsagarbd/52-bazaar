import React, { useEffect, useState } from "react";
import axios from 'axios';
import DefaultProImg from '../assets/images/default-img.jpg';
import Product from "./Product";

const ProductsList = ({ selectedCategory }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 20; // default, you can change this

  const apiUrl = import.meta.env.VITE_API_URL;

  axios.defaults.withCredentials = true;

  const fetchProducts = async (page = 1, limit = itemsPerPage) => {
    try {
      // const url = `${apiUrl}/api/products`;
      let url = `${apiUrl}/api/products?page=${page}&limit=${limit}`;

      if(selectedCategory){
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const response = await axios.get(url, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (Array.isArray(response.data.products)) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
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
    fetchProducts(currentPage);
  }, [currentPage, selectedCategory]);

  if (loading) return <div>Loading products...</div>;

  return (
      <>
        <div className="w-full md:w-3/4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <Product
              key={index}
              DefaultProImg={DefaultProImg}
              product={product}
            />
          ))}
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>

          {/* <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span> */}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </div>
      
      </>
  );
}

export default ProductsList;