import React from "react";
import { Link } from "react-router-dom";

import usePageTitle from "../../hooks/usePageTitle";
import Topbar from "./Topbar";
import Sidenav from "./Sidenav";
import MainContent from "./MainContent";

const Dashboard = () => {
    usePageTitle("Dashboard");
    return (
        <>
            <Topbar/>
            <Sidenav />
            <MainContent />
        </>
    );
}

export default Dashboard;