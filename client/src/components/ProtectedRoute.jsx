import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.user);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;