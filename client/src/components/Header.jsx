import React from "react";
import Logo from '../assets/images/52-bazaar-logo.png';
import NavanaLogo from '../assets/images/logo.png';
import { ShoppingCart, WhatsApp } from "@mui/icons-material";
import { Link } from "react-router-dom";
import CartBadge from "./CartBadge";

// const Header = () => {
//     return (
//         // <>
//         //     <div className='flex flex-col justify-center bg-[transparent] w-full h-[200px] items-center'>
//         //         <div className='flex justify-center w-full max-w-[1100px]'>
//         //             <img src={Logo} width="150" height="150" alt="52-bazaar" />
//         //         </div>
//         //     </div>
//         //     <div className='flex flex-col justify-center bg-[#ff0000] w-full items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'>
//         //         <div className='flex justify-center w-full max-w-[1100px]'>
//         //             <ul className="flex divide-x-2 divide-white text-white font-semibold py-3">
//         //                 <li className='px-3'><Link to='/admin'>Login</Link></li>
//         //                 <li className='px-3'>
//         //                     <CartBadge />
//         //                 </li>
//         //                 <li className='px-3'>Menu 3</li>
//         //                 <li className='px-3'>Menu 4</li>
//         //             </ul>
//         //         </div>
//         //     </div>
//         // </>
//     );
// }

const Header = () => {
  return (
    <header className="bg-white border-b shadow-sm py-3">
      <div className="container mx-auto flex items-center justify-evenly px-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={Logo} alt="52-bazaar" className="w-[80px] h-auto" />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 px-8">
          <form className="flex max-w-2xl mx-auto">
            <input
              type="text"
              name="term"
              placeholder="Search item"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right: Cart, Sell Item, Login */}
        <div className="flex items-center space-x-3">
          {/* CartBadge component (with image & count) */}
          <Link to="/cart" className="relative">
            <CartBadge />
          </Link>

          {/* Sell Item */}
          <a
            href="https://wa.me/8801994282802" // Replace with your actual WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsApp style={{ fontSize: "32px", color: "green" }} />
          </a>

          {/* Login */}
          <Link to="/admin">
            <button className="border px-4 py-2 rounded-md text-gray-800 hover:bg-gray-100">
              Login
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;