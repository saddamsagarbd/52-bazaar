import React from "react";

import usePageTitle from '../hooks/usePageTitle';
import Header from './Header'
import ProductsList from './ProductsList'
import About from './About'
import Footer from './Footer'

const LandingPage = () => {
    usePageTitle("52 Bazaar | Home");
    return (
        <>
            <Header />
            <ProductsList />
            <About />
            <Footer />
        </>
    );
}

export default LandingPage;