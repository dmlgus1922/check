import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function EventList() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (err) {
        setError('이벤트를 가져오는 데 실패했습니다.');
      }
    };

    fetchEvents();
  }, []);

  if (error) {
    return <div className="container mx-auto my-8">{error}</div>;
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">이벤트 목록</h1>
      {events.length === 0 ? (
        <p>등록된 이벤트가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-2">
                <Link to={`/event/${event.id}`} className="text-blue-600 hover:underline">
                  {event.title}
                </Link>
              </h2>
              <p className="text-gray-600">날짜: {event.event_date}</p>
              <p className="text-gray-600">작성자: {event.user_email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;