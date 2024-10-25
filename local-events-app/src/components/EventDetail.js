// src/components/EventDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'
import axios from 'axios';
import MyMap from './MyMap';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('해당 이벤트를 찾을 수 없습니다.');
        } else {
          setError('이벤트를 가져오는 데 실패했습니다.');
        }
      }
    };

    fetchEventDetail();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('해당 이벤트를 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // 삭제 성공 후 이벤트 목록 페이지로 이동
        navigate('/events');
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('이벤트를 삭제할 권한이 없습니다.');
        } else {
          setError('이벤트 삭제에 실패했습니다.');
        }
      }
    }
  };

  if (error) {
    return <div className="container mx-auto my-8">{error}</div>;
  }

  if (!event) {
    return <div className="container mx-auto my-8">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto my-8">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-2">날짜: {event.event_date}</p>
        <p className="text-gray-600 mb-4">작성자: {event.user_email}</p>
        <p className="text-gray-800 mb-6">{event.description}</p>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
        
          <MyMap />
    </div>
  );
}

export default EventDetail;
