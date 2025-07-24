import React, { useEffect, useState } from "react";
import axios from 'axios';
import usePageTitle from "../hooks/usePageTitle";
import ProductsList from "./ProductsList";
import HeroSlider from "./HeroSlider";
import SidebarFilters from "./SidebarFilters";
import { toast } from 'react-toastify';
import NavigationBar from "./NavigationBar";

const LandingPage = () => {
  usePageTitle("52 Bazaar | Home");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchCategories = async () => {
      try {
          const url = `${apiUrl}/api/categories`;
          const response = await axios.get(url, {
              withCredentials: true,
              headers: {
                  // 'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });

          if (Array.isArray(response.data.categories)) {
              setCategories(response.data.categories);
          } else {
              console.error("Unexpected response format:", response.data.categories);
          }
          
      } catch (err) {
          toast.error("Failed to fetch categories");
      }
  };

  useEffect(() => {
      fetchCategories(apiUrl);
  }, []);

  return (
    <>
      <div className="min-h-[60px] pt-4 relative">
        <NavigationBar categories={categories} onCategorySelect={setSelectedCategory} />
        <HeroSlider />
      </div>
      <main className="flex flex-grow p-4 gap-4">
        <div className="flex flex-col justify-center bg-transparent w-full items-center p-4">
          <div className="flex justify-center w-full max-w-[1080px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              
              <button
                className="lg:hidden max-w-[40px] mb-4 px-2 py-2 bg-gray-200 text-gray rounded"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
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

              {/* Sidebar Filters */}
              <div className={`w-full lg:w-1/4 ${isFilterOpen ? "block" : "hidden"} lg:block`}>
                <SidebarFilters categories={categories} onCategorySelect={setSelectedCategory} />
              </div>

              {/* Product List */}
              <div className="w-full lg:w-3/4">
                <ProductsList selectedCategory={selectedCategory} />
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* <ProductsList /> */}
    </>
  );
};

export default LandingPage;
