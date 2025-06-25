import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <>
      <div className="flex flex-col justify-center bg-[#6AB802] w-full items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex justify-center w-full max-w-[1100px]">
          <ul className="flex divide-x-2 divide-white text-white font-semibold py-3">
            <li className="px-3">Grocery</li>
            <li className="px-3">Electronics</li>
            <li className="px-3">Accessories</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
