// ✅ File: frontend/src/components/TeacherDashboard.jsx

import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="teacher-dashboard-wrapper">
        <div className="teacher-dashboard-card">
          <h2>Welcome Faculty 👩‍🏫</h2>
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
      <Footer />
    </>
  );
}

export default TeacherDashboard;
