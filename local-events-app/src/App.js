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
import PrivateRoute from './components/PrivateRoute';
import CheckUser from './components/CheckUser';
import { NavermapsProvider, Map } from 'react-naver-maps'
import MyMap from './components/MyMap';

function App() {
  return (
    <Router>
      <NavermapsProvider
            ncpClientId='44886raamo'
        >
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* <Route path="/" element={<EventList />} /> */}
            <Route path="/" element={<CheckUser />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/create" element={
              <PrivateRoute>
                <CreateEvent />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          <MyMap />
          </Routes>

        </main>
        <Footer />
      </div>
      </NavermapsProvider>

    </Router>
  );
}

export default App;
