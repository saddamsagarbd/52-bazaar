import React from "react";

const Product = ({ imgSrc, title, price }) => {
    return <div className="bg-white shadow-lg rounded-lg overflow-hidden group p-3">
        <img
        className="w-full h-60 object-cover p-3"
        src={imgSrc}
        alt="Product 1"
        />
        <div className="p-4">
        <h2 className="text-gray-800 text-lg font-semibold">{title}</h2>
        <p className="text-gray-600 text-lg mt-1">{price} Tk.</p>

        <div className="mt-4 flex space-x-2 opacity-100 transition-opacity duration-300">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded">
            Add to Cart
            </button>
            <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 rounded">
            Quick View
            </button>
        </div>
        </div>
    </div>
}

export default Product;