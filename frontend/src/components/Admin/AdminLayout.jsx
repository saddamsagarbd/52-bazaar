import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidenav from "./Sidenav";

const AdminLayout = () => {
    return (
        <>
            <Topbar/>
            <Sidenav />
            <Outlet />
        </>
    );
}

export default AdminLayout;