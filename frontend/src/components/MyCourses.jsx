import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './TeacherDashboard.css';
import { getAuthHeaders, checkAndHandleAuthError } from '../utils/auth';

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:8000/faculty/my-courses', {
        headers: getAuthHeaders()
      });

      if (!checkAndHandleAuthError(res, navigate)) return;

      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      alert('Error loading courses');
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const res = await fetch(`http://localhost:8000/faculty/delete-course/${courseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!checkAndHandleAuthError(res, navigate)) return;

      if (res.ok) {
        alert('Course deleted!');
        fetchCourses();
      } else {
        const err = await res.json();
        alert('Error: ' + err.detail);
      }
    } catch (error) {
      alert('Failed to delete course');
    }
  };

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('Unauthorized access. Please login.');
      navigate('/');
    } else {
      fetchCourses();
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="teacher-dashboard-wrapper">
        <div className="teacher-dashboard-card">
          <h2>📘 My Courses</h2>
          <div className="teacher-tile-container">
            {courses.length > 0 ? (
              courses.map(course => (
                <div className="tile" key={course.id}>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <button className="red-btn" onClick={() => handleDelete(course.id)}>🗑 Delete</button>
                </div>
              ))
            ) : (
              <p>No courses found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyCourses;
