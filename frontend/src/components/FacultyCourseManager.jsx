import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders, checkAndHandleAuthError } from '../utils/auth';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './FacultyCourseManager.css';

function FacultyCourseManager() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:8000/faculty/my-courses', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!checkAndHandleAuthError(res, navigate)) return;

      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      alert('Something went wrong while fetching courses.');
    }
  };

  const handleAddCourse = async () => {
    if (!title || !description) {
      alert("Please fill in both title and description.");
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/faculty/add-course', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description })
      });

      if (!checkAndHandleAuthError(res, navigate)) return;

      const data = await res.json();
      alert("✅ Course added successfully!");
      setTitle('');
      setDescription('');
      fetchCourses(); // Refresh course list
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Something went wrong while adding the course.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <Header />
      <div className="faculty-course-manager">
        <h2>📚 Faculty Course Manager</h2>

        <div className="add-course-form">
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button className="blue-btn" onClick={handleAddCourse}>➕ Add Course</button>
        </div>

        <div className="course-list">
          <h3>📖 Your Courses</h3>
          {courses.length === 0 ? (
            <p>No courses added yet.</p>
          ) : (
            <ul>
              {courses.map((course) => (
                <li key={course.id}>
                  <strong>{course.title}</strong>
                  <p>{course.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FacultyCourseManager;
