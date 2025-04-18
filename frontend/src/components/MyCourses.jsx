import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './TeacherDashboard.css';

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch('http://localhost:8000/faculty/my-courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        if (res.status === 401) {
          alert('Session expired. Please login again.');
          handleLogout();
          return;
        }
        const err = await res.json();
        throw new Error(err.detail || 'Failed to fetch courses');
      }

      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      alert('Error loading courses');
    }
  };

  const handleDelete = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const res = await fetch(`http://localhost:8000/faculty/delete-course/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
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
                  <button onClick={() => handleDelete(course.id)}>🗑 Delete</button>
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
