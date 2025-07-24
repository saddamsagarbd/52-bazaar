import { useState } from "react";

const NavigationBar = ({ categories, onCategorySelect }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  return (
    <div className="min-h-[60px] sticky top-0 z-50 flex flex-col justify-center bg-[#6AB802] w-full items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex justify-center w-full max-w-[1080px] mx-auto overflow-x-auto">
        <button
          className="lg:hidden max-w-[40px] px-2 py-2 bg-gray-200 text-white-800 rounded absolute top-2 left-2 z-51"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <ul
          className={`transition-all duration-300 ease-in-out ${
            showMenu ? "flex" : "hidden"
          } flex-col lg:flex lg:flex-row text-white font-semibold py-3 px-2 gap-2 whitespace-nowrap`}
        >
          {categories.map((category) => (
            <li
              key={category._id}
              onClick={() => {
                onCategorySelect(category._id);
                setShowMenu(false);
              }}
              className="px-3 py-1 cursor-pointer text-white hover:bg-white hover:text-[#6AB802] rounded transition"
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default NavigationBar;