// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // 페이지 이동을 위해

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 에러 메시지 상태 추가
  const [error, setError] = useState('');
  const navigate = useNavigate();  // 페이지 이동을 위해

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 백엔드로 POST 요청 보내기
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      // JWT 토큰을 localStorage에 저장
      localStorage.setItem('token', response.data.token);

      // 로그인 성공 후 페이지 이동
      navigate('/');  // 홈 페이지로 이동하거나 원하는 페이지로 이동

    } catch (err) {
      // 에러 처리
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('서버와 통신 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">로그인</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">이메일:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
        >
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;
