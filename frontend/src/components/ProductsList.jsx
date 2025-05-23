import React, { useEffect, useState } from "react";
import axios from 'axios';
import DefaultProImg from '../assets/images/default-img.jpg';
import Product from "./Product";

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const folderUrl = import.meta.env.VITE_API_URL_FILE_LOCATION;

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/products`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data);
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.error("Unexpected response format:", response.data);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    useEffect(() => {
        // setProducts([]);
        fetchProducts();
    }, []);

    return (
        <div className='flex flex-col justify-center bg-[transparent] w-full items-center'>
            <div className='flex justify-center w-full max-w-[1100px]'>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        products.map(({name, price, imgUrl}, index) => (
                            <Product key={index} imgSrc={imgUrl?`${folderUrl}`+imgUrl:DefaultProImg} title={name} price={price} />
                        ))
                    }
                </div>
            </div>
            </div>
        </div>
    );
}

export default ProductsList;