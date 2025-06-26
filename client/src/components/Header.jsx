import React from "react";
import Logo from "../assets/images/52-bazaar-logo.png";
import NavanaLogo from "../assets/images/logo.png";
import {
  ShoppingCart,
  WhatsApp,
  Facebook,
  LinkedIn,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import CartBadge from "./CartBadge";

const Header = () => {
  return (
    <header className="bg-white border-b shadow-sm py-3 max-w-[990px] mx-auto">
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
              className="bg-[#6AB802] text-white px-4 py-2 rounded-r-md hover:bg-[#6AB802]"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right: Cart, Sell Item, Login */}
        <div className="flex items-center space-x-3 md:static md:flex-row fixed bottom-0 left-0 right-0 bg-white border-t md:border-none justify-around md:justify-end py-2 md:py-0 z-50">
          {/* CartBadge */}
          <Link to="/cart" className="relative">
            <CartBadge />
          </Link>

          {/* WhatsApp */}
          <a
            href="https://wa.me/8801994282802"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsApp style={{ fontSize: "28px", color: "green" }} />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook style={{ fontSize: "28px", color: "blue" }} />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedIn style={{ fontSize: "28px", color: "skyblue" }} />
          </a>

          {/* Login */}
          <Link to="/admin">
            <button className="bg-[#6AB802] border px-4 py-1 rounded-md text-white hover:bg-[#6AB802]">
              Login
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
