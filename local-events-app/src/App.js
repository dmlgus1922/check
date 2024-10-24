// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import CreateEvent from './components/CreateEvent';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';  // 추가

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/create" element={
          <PrivateRoute>
            <CreateEvent />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
