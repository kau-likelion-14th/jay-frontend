// 필요한 컴포넌트와 기능을 가져와 App.js에서 사용
import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer'
import MainPage from './pages/Mainpage/Mainpage';
import LoginPage from './pages/LoginPage/Loginpage';
import FriendPage from './pages/FriendPage/FriendPage';
import FriendDetailPage from './pages/FriendPage/FriendDetailPage';
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation(); // useLocation()으로 현재 URL 정보를 가져와 location에 저장
  const isLoginPage = location.pathname === '/login'; // 현재 페이지가 /login이면 true, 아니면 false를 isLoginPage에 저장
  // 아래 Header, Footer를 보여줄지 말지 판단할 때 사용

  return (
    <div className="App">
      {/* 로그인 페이지가 아닐때만 Header를 화면에 띄움*/}
      {!isLoginPage && <Header />}

      {/* url 경로에 따라 보여줄 페이지 컴포넌트를 결정 */}   
    <div className ="content">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/friends" element={<FriendPage />} />
        <Route path="/friends/:id" element={<FriendDetailPage />} />
      </Routes>
    </div>  
      {/* 로그인 페이지가 아닐때만 Footer를 화면에 띄움*/}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;