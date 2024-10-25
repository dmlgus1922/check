import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CheckUser = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // localStorage에서 토큰 확인
    const token = localStorage.getItem('token');
    
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 이동
      navigate('/login');
    } else {
      // 토큰이 있으면 이벤트 상세 페이지로 이동
      navigate(`/events`); // 여기서 id는 이벤트 ID를 전달해야 합니다
    }
  }, [navigate]);
  
  // 리다이렉트하는 동안 보여줄 로딩 상태
  return (
    <div className="container mx-auto my-8">
      확인 중...
    </div>
  );
}

export default CheckUser
