import React, { useEffect, useState } from "react";
import axios from 'axios';
import DefaultProImg from '../assets/images/default-img.jpg';
import Product from "./Product";

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    axios.defaults.withCredentials=true;

    const fetchProducts = async (apiUrl) => {
        try {
            const url = `${apiUrl}/api/products`;
            console.log('Fetching products from:', url);

            const response = await axios.get(url, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (Array.isArray(response.data.products)) {
                setProducts(response.data.products);
            } else {
                console.error("Unexpected response format:", response.data.products);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false)   
        }
    };

    useEffect(() => {
        fetchProducts(apiUrl);
    }, [apiUrl]);

    if (loading) return <div>Loading products...</div>;

    return (
      <div className="flex flex-col justify-center bg-[transparent] w-full items-center p-4">
        <div className="flex justify-center w-full max-w-[990px] mx-auto">
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
              {products.map((product, index) => (
                  <Product
                    key={index}
                    DefaultProImg={DefaultProImg}
                    product={product}
                  />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}

export default ProductsList;