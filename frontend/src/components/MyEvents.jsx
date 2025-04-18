import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './TeacherDashboard.css';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/faculty/my-events", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          handleLogout();
          return;
        }
        const err = await res.json();
        throw new Error(err.detail || "Failed to load events");
      }

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      alert("Error loading events");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "faculty") {
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
