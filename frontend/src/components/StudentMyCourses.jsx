// ✅ File: src/components/StudentMyCourses.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './StudentCourseCatalog.css';

function StudentMyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchMyCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch('http://localhost:8000/student/my-courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired. Please log in again.");
          handleLogout();
          return;
        }
        const err = await res.json();
        throw new Error(err.detail || "Failed to load registered courses");
      }

      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to load your courses.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "student") {
      alert("Unauthorized access. Please login as student.");
      navigate('/');
    } else {
      fetchMyCourses();
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="catalog-container">
        <h2>🎓 My Registered Courses</h2>
        <div className="catalog-list">
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            ))
          ) : (
            <p className="no-courses">You are not registered in any courses yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentMyCourses;
