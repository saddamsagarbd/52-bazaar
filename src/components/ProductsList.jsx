import React from "react";

import DefaultProImg from '../assets/images/default-img.jpg';
import Product from "./Product";

const products = [
    {
        'source': DefaultProImg,
        'title' : 'Product 1',
        'price' : '29.99'
    },
    {
        'source': DefaultProImg,
        'title' : 'Product 2',
        'price' : '29.99'
    },
    {
        'source': DefaultProImg,
        'title' : 'Product 3',
        'price' : '29.99'
    },
    {
        'source': DefaultProImg,
        'title' : 'Product 4',
        'price' : '29.99'
    },
    {
        'source': DefaultProImg,
        'title' : 'Product 5',
        'price' : '29.99'
    },
    {
        'source': DefaultProImg,
        'title' : 'Product 6',
        'price' : '29.99'
    },
];

const ProductsList = () => {
    return (
        <div className='flex flex-col justify-center bg-[transparent] w-full items-center'>
            <div className='flex justify-center w-full max-w-[1100px]'>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        products.map(({source, title, price}, index) => (
                            <Product key={index} imgSrc={source} title={title} price={price} />
                        ))
                    }
                    {/* <Product imgSrc={DefaultProImg} title="Product 1" price="29.99" />
                    <Product imgSrc={DefaultProImg} title="Product 2" price="29.99" />
                    <Product imgSrc={DefaultProImg} title="Product 3" price="29.99" />
                    <Product imgSrc={DefaultProImg} title="Product 4" price="29.99" />
                    <Product imgSrc={DefaultProImg} title="Product 5" price="29.99" />
                    <Product imgSrc={DefaultProImg} title="Product 6" price="29.99" />
                    <Product imgSrc={DefaultProImg} title="Product 7" price="29.99" />
                    <Product imgSrc={DefaultProImg} title="Product 8" price="29.99" />
                    <Product imgSrc={DefaultProImg} title="Product 9" price="29.99" />
                    <Product imgSrc={DefaultProImg} title="Product 10" price="29.99" /> */}
                </div>
            </div>
            </div>
        </div>
    );
}

export default ProductsList;