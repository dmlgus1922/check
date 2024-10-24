// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link to="/">로컬 이벤트 앱</Link>
        </div>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:underline">홈</Link></li>
          {token ? (
            <>
              <li><Link to="/create" className="hover:underline">이벤트 생성</Link></li>
              <li><button onClick={handleLogout} className="hover:underline">로그아웃</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:underline">로그인</Link></li>
              <li><Link to="/signup" className="hover:underline">회원가입</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
