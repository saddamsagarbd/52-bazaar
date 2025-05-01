import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/Admin/Login';
import AdminDashboard from './components/Admin/Dashboard'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            {/* <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} /> */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
