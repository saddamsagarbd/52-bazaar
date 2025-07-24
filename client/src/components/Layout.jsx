import React from "react";

import usePageTitle from "../hooks/usePageTitle";
import Header from "./Header";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
    usePageTitle("52 Bazaar | Home");
    return (
        <div className="overflow-x-hidden min-h-screen flex flex-col">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Layout;
