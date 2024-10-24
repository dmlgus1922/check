import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateEvent() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      // 백엔드로 POST 요청 보내기 (토큰 포함)
      await axios.post('http://localhost:5000/api/events', {
        title,
        date,
        description,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 이벤트 생성 후 페이지 이동
      navigate('/');

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
      <h1 className="text-3xl font-bold mb-6">이벤트 생성</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">제목:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">날짜:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">설명:</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 h-32"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          생성하기
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;