import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/Admin/Login';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/Dashboard'
import AdminCategories from './components/Admin/Categories'
import AdminProducts from './components/Admin/Product';
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initCart } from './redux/cartActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      dispatch(loginSuccess({ token, user }));
    }

    dispatch(initCart());
  }, [dispatch]);


  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={
          <RedirectIfLoggedIn>
            <AdminLogin />
          </RedirectIfLoggedIn>
        } />
        <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="categories" element={
              <ProtectedRoute>
                <AdminCategories />
              </ProtectedRoute>
            } />
            <Route path="products" element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
