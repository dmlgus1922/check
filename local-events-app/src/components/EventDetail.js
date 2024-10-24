// src/components/EventDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EventDetail() {
  const { id } = useParams();
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

  if (error) {
    return <div className="container mx-auto my-8">{error}</div>;
  }

  if (!event) {
    return <div className="container mx-auto my-8">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-600 mb-2">날짜: {event.event_date}</p>
      <p className="text-gray-600 mb-2">작성자: {event.user_email}</p>
      <p className="text-gray-800">{event.description}</p>
    </div>
  );
}

export default EventDetail;