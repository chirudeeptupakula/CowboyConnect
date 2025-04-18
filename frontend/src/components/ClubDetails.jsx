import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getAuthHeaders } from '../utils/auth';

function ClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/student/clubs/${id}`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => setClub(data))
      .catch(() => alert("Failed to load club details"));
  }, [id]);

  if (!club) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="student-dashboard-wrapper">
        <div className="student-dashboard-card">
          <h2>{club.name}</h2>
          <p>{club.description}</p>
          {/* Optionally show events, members, etc. */}
          <button onClick={() => navigate('/student-clubs')} className="blue-btn">
            ← Back to Clubs
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ClubDetails;
