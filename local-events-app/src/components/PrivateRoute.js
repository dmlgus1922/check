// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
