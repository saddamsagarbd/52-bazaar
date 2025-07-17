import React from "react";
import { Link, useLocation } from "react-router-dom";

import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';

const menuItems = [
    { name: "Dashboard", icon: DashboardIcon, to: "/admin/dashboard" },
    { name: "Categories", icon: CategoryIcon, to: "/admin/categories", badge: "" },
    { name: "Products", icon: InventoryIcon, to: "/admin/products", badge: "" },
    { name: "Orders", icon: InventoryIcon, to: "/admin/orders", badge: "" },
];

const Sidenav = () => {
    const location = useLocation();
    return (
        <>
            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                    {menuItems.map((item, index) => {
                        // Check if the current path matches the menu item's path
                        const isActive = location.pathname === item.to;

                        return (
                            <li key={index}>
                                <Link
                                    to={item.to}
                                    className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${isActive ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                                >
                                    <item.icon className="w-5 h-5 text-gray-500" />
                                    <span className="ms-3">{item.name}</span>
                                    {item.badge && (
                                        <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                    </ul>
                </div>
            </aside>
        </>
    );
}

export default Sidenav;