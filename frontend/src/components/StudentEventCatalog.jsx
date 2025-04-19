import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
//import './StudentEventCatalog.css';
import { getAuthHeaders, checkAndHandleAuthError } from '../utils/auth';
import './StudentCourseCatalog.css';


function StudentEventCatalog() {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:8000/events/available', {
        headers: getAuthHeaders(),
      });

      if (!checkAndHandleAuthError(res, navigate)) return;
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      alert("Failed to load events.");
    }
  };

  const handleJoin = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:8000/events/register/${eventId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!checkAndHandleAuthError(res, navigate)) return;
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setJoinedEvents([...joinedEvents, eventId]);
      } else {
        alert(data.detail || "Registration failed.");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "student") {
      alert("Unauthorized access. Please login as student.");
      navigate('/');
    } else {
      fetchEvents();
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="catalog-container">
        <h2>🎉 Available Events</h2>
        <div className="catalog-list">
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="course-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                <button
                  disabled={joinedEvents.includes(event.id)}
                  onClick={() => handleJoin(event.id)}
                >
                  {joinedEvents.includes(event.id) ? '✅ Joined' : 'Join Event'}
                </button>
              </div>
            ))
          ) : (
            <p className="no-courses">No events available.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentEventCatalog;
