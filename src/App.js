import { Routes, Route, useLocation } from 'react-router-dom';
import Mainpage from './pages/Mainpage/Mainpage';
import React from 'react';
import './App.css';
import Header from "./components/Header";
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage/Loginpage';
import MyPage from './pages/MyPage/MyPage';

function App() {
  const location = useLocation(); 
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App">
      {!isLoginPage && <Header />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
      {!isLoginPage && <Footer/>}
    </div>
  );
}

export default App;