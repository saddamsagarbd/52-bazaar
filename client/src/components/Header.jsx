import React from "react";
import Logo from "../assets/images/52-bazaar-logo.png";
import NavanaLogo from "../assets/images/logo.png";
import {
  SearchRounded,
  WhatsApp,
  Facebook,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import CartBadge from "./CartBadge";

const Header = () => {
  return (
    <header className="bg-white border-b shadow-sm py-3 max-w-[990px] mx-auto">
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 py-2 space-y-3 md:space-y-0">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img
              src={Logo}
              alt="52-bazaar"
              className="w-20 h-auto md:w-[80px]"
            />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="w-full md:flex-1">
          <form className="flex w-full max-w-full md:max-w-2xl mx-auto">
            <input
              type="text"
              name="term"
              placeholder="Search item"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-[#6AB802] text-white px-4 py-2 rounded-r-md hover:bg-[#6AB802]"
            >
              <SearchRounded style={{ fontSize: "28px", color: "#FFFFFF" }} />
            </button>
          </form>
        </div>

        {/* Right: Cart, Sell Item, Login */}
        {/* <div className="flex items-center space-x-3 md:static md:flex-row fixed bottom-0 left-0 right-0 bg-white border-t md:border-none justify-around md:justify-end py-2 md:py-0 z-50"> */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-around gap-4 bg-white px-6 py-3 rounded-full shadow-lg md:shadow-none z-50 md:static md:translate-x-0">
          {/* CartBadge */}
          <Link to="/cart" className="relative">
            <CartBadge />
          </Link>

          {/* WhatsApp */}
          <a
            href="https://wa.me/8801896270659"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsApp style={{ fontSize: "28px", color: "green" }} />
          </a>
          <a
            href="https://www.facebook.com/share/14DkMAnoDNA/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook style={{ fontSize: "28px", color: "blue" }} />
          </a>
          <a
            href="https://youtube.com/@eurovisionbd?si=PpE2_a1X0qBsFjVr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YouTube style={{ fontSize: "28px", color: "red" }} />
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
