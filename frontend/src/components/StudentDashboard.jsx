import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './StudentDashboard.css';

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          <h2 className="welcome-text">Welcome Student 👋</h2>
          <div className="tile-container">
            <div className="tile card-glass" onClick={() => navigate('/courses')}>
              <img src="/title/course.png" alt="Courses" className="tile-img-full" />
              <h3>📘 Courses</h3>
              <p>Browse available course listings</p>
            </div>

            <div className="tile card-glass" onClick={() => navigate('/events')}>
              <img src="/title/events.png" alt="Events" className="tile-img-full" />
              <h3>🎉 Events</h3>
              <p>Explore and join student clubs</p>
            </div>

            <div className="tile card-glass" onClick={() => navigate('/student-clubs')}>
              <img src="/title/clubs.png" alt="Clubs" className="tile-img-full" />
              <h3>🏛️ Clubs</h3>
              <p>Browse and join student clubs</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentDashboard;
