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
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/authSlice';
import Modal from 'react-modal';
// import 'flowbite';
// import 'flowbite-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      dispatch(loginSuccess({ token, user }));
    }
  }, [dispatch]);


  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
      </Router>
    </>
  );
}

export default App;
