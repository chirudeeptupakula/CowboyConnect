import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />

      <div className="teacher-dashboard-wrapper">
        <div className="teacher-dashboard-card">
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Welcome Faculty 👩‍🏫</h2>
          <div className="teacher-tile-container">
            <div className="tile" onClick={() => navigate('/teacher/my-courses')}>
              <h3>📘 My Courses</h3>
              <p>View and manage your courses</p>
            </div>
            <div className="tile" onClick={() => navigate('/teacher/my-events')}>
              <h3>🎉 My Events</h3>
              <p>See your created events and programs</p>
            </div>
            <div className="tile" onClick={() => navigate('/teacher/add')}>
              <h3>➕ Add Course or Event</h3>
              <p>Create a new course or event</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box">
            <p>{modalMessage}</p>
            <button className="blue-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default TeacherDashboard;
