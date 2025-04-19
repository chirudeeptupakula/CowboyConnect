import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './StudentCourseCatalog.css'; // ✅ Reuse styles
import { getAuthHeaders, checkAndHandleAuthError } from '../utils/auth';

function StudentMyEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    try {
      const res = await fetch('http://localhost:8000/events/my-joined', {
        headers: getAuthHeaders(),
      });

      if (!checkAndHandleAuthError(res, navigate)) return;
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      alert("Unable to load your events.");
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "student") {
      alert("Unauthorized access. Please login as student.");
      navigate('/');
    } else {
      fetchMyEvents();
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="catalog-container">
        <h2>🎯 My Joined Events</h2>
        <div className="catalog-list">
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="course-card">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="no-courses">You haven't joined any events yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentMyEvents;
