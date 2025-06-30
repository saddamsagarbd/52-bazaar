import React from "react";

import usePageTitle from "../hooks/usePageTitle";
import Header from "./Header";
import NavigationBar from "./NavigationBar";
import ProductsList from "./ProductsList";
import About from "./About";
import Footer from "./Footer";
import HeroSlider from "./HeroSlider";

const LandingPage = () => {
  usePageTitle("52 Bazaar | Home");
  return (
    <div className="overflow-x-hidden">
      <Header />
      <NavigationBar />
      <HeroSlider />
      <ProductsList />
      <Footer />
    </div>
  );
};

export default LandingPage;
