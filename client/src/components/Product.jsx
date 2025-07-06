import { ShoppingCart } from "@mui/icons-material";
import React from "react";
import { useCart } from "./CartContext";

const Product = ({ product, DefaultProImg }) => {

  const { addToCart } = useCart();

  console.log(product);

  if (!product) return null;

  const { imgUrl, name, price } = product;

  console.log(imgUrl);

  return (
    <div className="bg-white shadow-lg rounded-[0.5rem] overflow-hidden group p-3 border-[0.1rem] border-[#ececea] min-h-[250px] flex flex-col">
      <div className="w-full h-[120px] flex items-center justify-center overflow-hidden">
        <img
          className="object-contain h-full max-w-full group-hover:scale-105 transition-transform duration-300"
          src={imgUrl || DefaultProImg}
          alt={name}
        />
      </div>
      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">{name}</h2>
          <p className="text-gray-700 mt-1">{price} Tk.</p>
        </div>

        {/* <button 
          onClick={() => addToCart(product)}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          <ShoppingCart style={{ fontSize: "16px", color: "#FFFFFF" }} /> Add to Cart
        </button> */}
        {/* <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 rounded">
            Quick View
          </button> */}
      </div>
      {/* <div className="p-4">
        <h2 className="text-gray-800 text-lg font-semibold">{name}</h2>
        <p className="text-gray-600 text-lg mt-1">{price} Tk.</p>

        <div className="mt-4 flex space-x-2 opacity-100 transition-opacity duration-300">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart style={{ fontSize: "16px", color: "#FFFFFF" }} /> Add
            to Cart
          </button>
          <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-2 rounded">
            Quick View
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Product;
