import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './ClubDetails.css';
import { getAuthHeaders } from '../utils/auth';

function ClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [timesheetId, setTimesheetId] = useState(null);
  const [volunteerLogs, setVolunteerLogs] = useState([]);

  const CLUB_DETAILS = {
    "AI Club": {
      image: "ai_club.png",
      description: "The AI Club is a space for students who are passionate about artificial intelligence...",
      ideology: "We believe in responsible AI development..."
    },
    "Robotics Club": {
      image: "robotics_club.png",
      description: "The Robotics Club brings together students interested in building and programming robots.",
      ideology: "We value curiosity, engineering discipline..."
    },
    "Coding Ninjas": {
      image: "coding_ninjas.png",
      description: "Sharpen programming skills and ace competitive contests...",
      ideology: "We promote consistent problem-solving and learning."
    },
    "Eco Warriors": {
      image: "eco_warriors.png",
      description: "Dedicated to sustainability and climate awareness.",
      ideology: "Our ideology is rooted in mindfulness and nature conservation."
    },
    "Cultural Committee": {
      image: "cultural_committee.png",
      description: "Organizes campus festivals and cultural events.",
      ideology: "We thrive on diversity, expression, and inclusiveness."
    }
  };

  // ✅ Load saved timesheet from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem('active_timesheet_id');
    if (storedId) setTimesheetId(storedId);
  }, []);

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

    fetch(`http://localhost:8000/student/club/${id}/events`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(setEvents)
      .catch(() => setEvents([]));

    fetch(`http://localhost:8000/student/volunteer/check?club_id=${id}`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => setIsVolunteer(data.is_volunteer))
      .catch(() => setIsVolunteer(false));

    fetch(`http://localhost:8000/student/volunteer/logs?club_id=${id}`, {
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(setVolunteerLogs)
      .catch(() => setVolunteerLogs([]));
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

  const handleVolunteer = async () => {
    try {
      const res = await fetch(`http://localhost:8000/student/clubs/${id}/volunteer`, {
        method: "POST",
        headers: getAuthHeaders()
      });

      if (res.ok) {
        alert("✅ You're now a volunteer!");
        setIsVolunteer(true); // ✅ key line!
      } else {
        const data = await res.json();
        if (data.detail === "Already a volunteer") {
          alert(data.detail);
          setIsVolunteer(true); // ✅ Even if already a volunteer, update UI
        } else {
          alert(data.detail || "Could not register as volunteer.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error volunteering.");
    }
  };


  const handleClockIn = async () => {
    try {
      const res = await fetch(`http://localhost:8000/student/volunteer/clockin`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ club_id: parseInt(id), description: "Volunteer session" })
      });
      const data = await res.json();
      console.log("⏱️ Clock In Success:", data);
      setTimesheetId(data.timesheet_id);
      localStorage.setItem("active_timesheet_id", data.timesheet_id);
      alert("⏱️ Clocked In!");
    } catch (err) {
      console.error(err);
      alert("Error clocking in.");
    }
  };

  const handleClockOut = async () => {
    try {
      const res = await fetch(`http://localhost:8000/student/volunteer/clockout`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ timesheet_id: timesheetId })
      });
      const data = await res.json();
      console.log("🛑 Clock Out Success:", data);
      alert(`🛑 Clocked Out! Duration: ${data?.total_hours ?? 0} hrs`);
      setTimesheetId(null);
      localStorage.removeItem("active_timesheet_id");
    } catch (err) {
      console.error(err);
      alert("Error clocking out.");
    }
  };

  if (!club) return <p>Loading club details...</p>;

  const clubData = CLUB_DETAILS[club.name];
  const imagePath = clubData?.image ? `/Club_Images/${clubData.image}` : '/default.jpg';

  return (
    <>
      <Header />
      <div className="club-details-container">
        <div className="club-image">
          <img src={imagePath} alt={club.name} />
        </div>

        <div className="club-info">
          <h2>{club.name}</h2>
          <p className="club-description">{clubData?.description || club.description}</p>

          {!isMember && (
            <button className="join-club-btn" onClick={handleJoin}>
              Join This Club
            </button>
          )}

          {isMember && !isVolunteer && (
            <button className="volunteer-btn" onClick={handleVolunteer}>
              Become a Volunteer
            </button>
          )}

          {isVolunteer && (
            <div className="volunteer-controls">
              {timesheetId === null ? (
                <button className="clockin-btn" onClick={handleClockIn}>Clock In</button>
              ) : (
                <button className="clockout-btn" onClick={handleClockOut}>Clock Out</button>

              )}
            </div>
          )}



          {isVolunteer && volunteerLogs.length > 0 && (
            <div className="volunteer-history">
              <h3>🧾 Your Volunteering History</h3>
              <ul className="volunteer-log-list">
                {volunteerLogs.map((log, idx) => (
                  <li key={idx}>
                    <strong>{new Date(log.date).toLocaleString()}</strong> — {log.hours} hrs
                    {log.description && <> — <em>{log.description}</em></>}
                  </li>
                ))}
              </ul>
            </div>
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
