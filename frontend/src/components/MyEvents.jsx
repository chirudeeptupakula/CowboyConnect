import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './TeacherDashboard.css';
import { getAuthHeaders, checkAndHandleAuthError } from '../utils/auth';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:8000/faculty/my-events", {
        headers: getAuthHeaders()
      });

      if (!checkAndHandleAuthError(res, navigate)) return;

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      alert("Error loading events");
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("userRole");

    if (!username || role !== "faculty") {
      alert("Unauthorized access. Please login.");
      navigate('/');
    } else {
      fetchEvents();
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="teacher-dashboard-wrapper">
        <div className="teacher-dashboard-card">
          <h2>🎉 My Events</h2>
          <div className="teacher-tile-container">
            {events.length > 0 ? (
              events.map(event => (
                <div className="tile" key={event.id}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <small>📍 {event.location}</small><br />
                  <small>📅 {new Date(event.date).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p>No events found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyEvents;
