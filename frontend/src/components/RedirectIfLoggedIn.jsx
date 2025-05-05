import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const RedirectIfLoggedIn = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.user);
    return isAuthenticated ? <Navigate to="/admin/dashboard" /> : children;
};

export default RedirectIfLoggedIn;