import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './StudentCourseCatalog.css';

function StudentCourseCatalog() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch('http://localhost:8000/student/courses', {
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
        throw new Error(err.detail || "Failed to load courses");
      }

      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Course fetch error:", error);
      alert("Failed to load courses");
    }
  };

  const handleRegister = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8000/student/register-course/${courseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Successfully registered!');
      } else {
        alert('⚠️ ' + (data.detail || 'Registration failed'));
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong!");
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
      fetchCourses();
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="catalog-container">
        <h2>📘 Available Courses</h2>
        <div className="catalog-list">
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <button onClick={() => handleRegister(course.id)}>Register</button>
              </div>
            ))
          ) : (
            <p className="no-courses">No courses available.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentCourseCatalog;
