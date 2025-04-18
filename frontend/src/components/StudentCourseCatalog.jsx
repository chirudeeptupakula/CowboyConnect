import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './StudentCourseCatalog.css';
import { getAuthHeaders, checkAndHandleAuthError } from '../utils/auth';

function StudentCourseCatalog() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:8000/student/courses', {
        headers: getAuthHeaders()
      });

      if (!checkAndHandleAuthError(res, navigate)) return;

      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Course fetch error:", error);
      alert("Failed to load courses");
    }
  };

  const handleRegister = async (courseId) => {
    try {
      const res = await fetch(`http://localhost:8000/student/register-course/${courseId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!checkAndHandleAuthError(res, navigate)) return;

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
