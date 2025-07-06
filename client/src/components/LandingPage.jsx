import React from "react";

import usePageTitle from "../hooks/usePageTitle";
import ProductsList from "./ProductsList";
import HeroSlider from "./HeroSlider";

const LandingPage = () => {
  usePageTitle("52 Bazaar | Home");
  return (
    <>
      <HeroSlider />
      <ProductsList />
    </>
  );
};

export default LandingPage;
