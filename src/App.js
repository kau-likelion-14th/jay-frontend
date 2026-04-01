import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import React from 'react';
import './App.css';
import Header from "./components/Header";
import Footer from './components/Footer';

function App() {
  return (
    <div className = "App">
      <Header/>
      <div className = "content">
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </div>
      <Footer/>
      
    </div>
  );
}

export default App;