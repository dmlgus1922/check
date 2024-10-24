// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 에러 메시지 상태 추가
  const [error, setError] = useState('');
  // 성공 메시지 상태 추가
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // 백엔드로 POST 요청 보내기
      const response = await axios.post('http://localhost:5000/api/signup', {
        email,
        password,
      });

      if (response.data.success) {
        setSuccess('회원가입이 완료되었습니다!');
        // 폼 초기화
        setEmail('');
        setPassword('');
      } else {
        setError('회원가입에 실패하였습니다.');
      }
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
      <h1 className="text-3xl font-bold mb-6">회원가입</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
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
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Signup;
