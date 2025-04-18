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

  // 🔁 Fetch all clubs
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

  // 🔁 Fetch joined club IDs
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

  // 📌 Join a club
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
        fetchJoinedClubs(); // Refresh membership
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
          <h2>🎓 Available Clubs</h2>
          <div className="student-tile-container">
            {clubs.length === 0 ? (
              <p>No clubs found.</p>
            ) : (
              clubs.map(club => (
                <div className="tile" key={club.id}>
                  <h3>{club.name}</h3>
                  <p>{club.description}</p>
                  {joinedClubIds.includes(club.id) ? (
                    <span className="joined-label">✅ Joined</span>
                  ) : (
                    <button className="blue-btn" onClick={() => handleJoin(club.id)}>Join</button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentClubs;
