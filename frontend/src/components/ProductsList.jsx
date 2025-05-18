import React, { useEffect, useState } from "react";
import axios from 'axios';
import DefaultProImg from '../assets/images/default-img.jpg';
import Product from "./Product";

// const products = [
//     {
//         'source': DefaultProImg,
//         'title' : 'Product 1',
//         'price' : '29.99'
//     },
//     {
//         'source': DefaultProImg,
//         'title' : 'Product 2',
//         'price' : '29.99'
//     },
//     {
//         'source': DefaultProImg,
//         'title' : 'Product 3',
//         'price' : '29.99'
//     },
//     {
//         'source': DefaultProImg,
//         'title' : 'Product 4',
//         'price' : '29.99'
//     },
//     {
//         'source': DefaultProImg,
//         'title' : 'Product 5',
//         'price' : '29.99'
//     },
//     {
//         'source': DefaultProImg,
//         'title' : 'Product 6',
//         'price' : '29.99'
//     },
// ];

const ProductsList = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.data;
            console.log
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className='flex flex-col justify-center bg-[transparent] w-full items-center'>
            <div className='flex justify-center w-full max-w-[1100px]'>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        products.map(({name, price, imgUrl}, index) => (
                            <Product key={index} imgSrc={imgUrl?`${process.env.REACT_APP_FILE_LOCATION}`+imgUrl:DefaultProImg} title={name} price={price} />
                        ))
                    }
                </div>
            </div>
            </div>
        </div>
    );
}

export default ProductsList;