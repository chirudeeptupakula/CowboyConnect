import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './ClubDetails.css';
import { getAuthHeaders, checkAndHandleAuthError } from '../utils/auth';

function ClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [isMember, setIsMember] = useState(false);

  const CLUB_DETAILS = {
    "AI Club": {
      image: "ai_club.png",
      description: "The AI Club is a space for students who are passionate about artificial intelligence, machine learning, and the future of intelligent systems. We explore trending tools like ChatGPT, computer vision, and generative AI through hands-on workshops and projects.",
      ideology: "We believe in responsible AI development, knowledge sharing, and inclusive growth. Our members collaborate on real-world challenges while developing ethical AI systems and presenting innovative solutions."
    },
    "Robotics Club": {
      image: "robotics_club.png",
      description: "The Robotics Club brings together students interested in designing, building, and programming robots. From autonomous bots to mechanical arms, our members compete in intercollegiate robotics tournaments and engage in exciting hackathons.",
      ideology: "We value curiosity, engineering discipline, and creative experimentation. Our motto is to 'build to learn' and 'fail fast, iterate faster'."
    },
    "Coding Ninjas": {
      image: "coding_ninjas.png",
      description: "Coding Ninjas is your go-to club for sharpening programming skills, acing competitive programming contests, and cracking interviews. Weekly LeetCode, Codeforces, and HackerRank sessions fuel our journey.",
      ideology: "We believe coding is a superpower that grows with community practice. We promote consistent problem-solving and peer-based learning."
    },
    "Eco Warriors": {
      image: "eco_warriors.png",
      description: "Eco Warriors is dedicated to environmental sustainability and climate awareness. We host tree plantation drives, awareness campaigns, and green hackathons that impact campus life positively.",
      ideology: "Our ideology is rooted in mindfulness, nature conservation, and grassroots leadership. Small actions can inspire big change."
    },
    "Cultural Committee": {
      image: "cultural_committee.png",
      description: "The Cultural Committee is the heartbeat of campus celebrations. We organize festivals, talent shows, cultural nights, and welcome freshers with unforgettable energy.",
      ideology: "We thrive on diversity, expression, and inclusiveness. Culture is what binds us together — and we aim to create moments worth remembering."
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8000/student/clubs`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        const selected = data.find(c => c.id === parseInt(id));
        setClub(selected);
      });

    fetch(`http://localhost:8000/student/my-clubs`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        const joined = data.some(c => c.id === parseInt(id));
        setIsMember(joined);
      });

    fetch(`http://localhost:8000/club/${id}/events`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));
  }, [id]);

  const handleJoin = async () => {
    try {
      const res = await fetch("http://localhost:8000/student/join-club", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ club_id: parseInt(id) })
      });

      if (res.ok) {
        alert("🎉 Successfully joined the club!");
        setIsMember(true);
      } else {
        const data = await res.json();
        alert(data.detail || "Could not join club.");
      }
    } catch (err) {
      console.error(err);
      alert("Error joining the club.");
    }
  };

  if (!club) return <p>Loading club details...</p>;

  const clubData = CLUB_DETAILS[club.name];
  const imagePath = clubData?.image ? `/Club_Images/${clubData.image}` : '/default.jpg';

  return (
    <>
      <Header />
      <div className="club-details-container">
        {/* Left Side: Image */}
        <div className="club-image">
          <img src={imagePath} alt={club.name} />
        </div>

        {/* Right Side: Info */}
        <div className="club-info">
          <h2>{club.name}</h2>
          <p className="club-description">{clubData?.description || club.description}</p>

          {!isMember && (
            <button className="join-club-btn" onClick={handleJoin}>
              Join This Club
            </button>
          )}

          <h3>🌟 Club Ideology</h3>
          <p>{clubData?.ideology || "This club is focused on collaboration, community, and creativity."}</p>

          <h3>📅 Upcoming Events</h3>
          {events.length > 0 ? (
            <ul className="event-list">
              {events.map((event, index) => (
                <li key={index}>
                  <strong>{event.title}</strong> — {event.date}
                  <p>{event.description}</p>
                  {!isMember ? (
                    <button className="register-btn">Register</button>
                  ) : (
                    <button className="volunteer-btn">Volunteer</button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming events.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ClubDetails;
