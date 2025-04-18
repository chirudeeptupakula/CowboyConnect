import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './StudentDashboard.css';
import { getAuthHeaders, checkAndHandleAuthError } from '../utils/auth';

function StudentClubs() {
  const [clubs, setClubs] = useState([]);
  const [joinedClubIds, setJoinedClubIds] = useState([]);
  const navigate = useNavigate();

  const fetchClubs = async () => {
    try {
      const res = await fetch("http://localhost:8000/student/clubs", {
        headers: getAuthHeaders()
      });
      if (!checkAndHandleAuthError(res, navigate)) return;
      const data = await res.json();
      setClubs(data);
    } catch (err) {
      console.error(err);
      alert("Error loading clubs");
    }
  };

  const fetchJoinedClubs = async () => {
    try {
      const res = await fetch("http://localhost:8000/student/my-clubs", {
        headers: getAuthHeaders()
      });
      if (!checkAndHandleAuthError(res, navigate)) return;
      const data = await res.json();
      const ids = data.map(club => club.id);
      setJoinedClubIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async (clubId) => {
    try {
      const res = await fetch("http://localhost:8000/student/join-club", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ club_id: clubId })
      });

      if (!checkAndHandleAuthError(res, navigate)) return;

      if (res.ok) {
        alert("Joined successfully!");
        fetchJoinedClubs();
      } else {
        const data = await res.json();
        alert(data.detail || "Error joining club");
      }
    } catch (error) {
      console.error("Error joining:", error);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (!username || role !== "student") {
      alert("Unauthorized access.");
      navigate('/');
    } else {
      fetchClubs();
      fetchJoinedClubs();
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="student-dashboard-wrapper">
        <div className="student-dashboard-card">
          <h2 style={{ textAlign: "center" }}>🏛️ Explore Student Clubs</h2>

          <div className="club-grid">
            {clubs.map((club, index) => (
              <div className="club-tile" key={club.id}>
                <div className="club-header">
                  <span className="club-icon">{['🤖', '🎯', '🧠', '🌱', '🎭'][index % 5]}</span>
                  <h2>{club.name}</h2>
                </div>

                <p className="club-snippet">{club.description.slice(0, 100)}...</p>

                <div className="club-actions">
                  <button className="explore-btn" onClick={() => navigate(`/club/${club.id}`)}>
                    🔍 Explore
                  </button>

                  {joinedClubIds.includes(club.id) ? (
                    <div className="club-status success">✅ Joined</div>
                  ) : (
                    <button className="join-glow-btn" onClick={() => handleJoin(club.id)}>
                      Join Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentClubs;
