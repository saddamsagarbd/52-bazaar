import React from 'react';
import './App.css';
import Footer from './components/Footer';
import About from './components/About';
import Header from './components/Header';
import ProductsList from './components/ProductsList';

function App() {
  return (
    <>
      <Header />
      <ProductsList />
      <About />
      <Footer />
    </>
  );
}

export default App;
