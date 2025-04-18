import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './StudentDashboard.css';
import ChatWidget from './Chatbot/ChatWidget';

import { Chatbot } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

import config from './Chatbot/ChatbotConfig';
import MessageParser from './Chatbot/MessageParser';
import ActionProvider from './Chatbot/ActionProvider';

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          <h2 className="welcome-text">Welcome Student 👋</h2>
          <div className="tile-container">
            <div className="tile" onClick={() => navigate('/courses')}>
              <img src="/title/course.png" alt="Courses" className="tile-img-full" />
              <h3>📘 Courses</h3>
              <p>Browse available course listings</p>
            </div>

            <div className="tile" onClick={() => navigate('/student/events')}>
              <img src="/title/events.png" alt="Events" className="tile-img-full" />
              <h3>🎉 Events</h3>
              <p>Explore and join events</p>
            </div>

            <div className="tile" onClick={() => navigate('/student-clubs')}>
              <img src="/title/clubs.png" alt="Clubs" className="tile-img-full" />
              <h3>🏛️ Clubs</h3>
              <p>Browse and join student clubs</p>
            </div>
          </div>


        </div>
      </div>

      {/* ✅ Floating Chatbot Widget */}
      <div style={{ position: 'fixed', bottom: '90px', right: '20px', zIndex: 999 }}>

      </div>
        <ChatWidget />

      <Footer />
    </>
  );
}

export default StudentDashboard;
