import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './TeacherDashboard.css';

function AddCourseEvent() {
  const [mode, setMode] = useState('course');
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 🔐 Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in.");
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (mode === 'event') {
      if (!form.location.trim()) newErrors.location = 'Location is required';
      if (!form.date) newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const endpoint = mode === 'course' ? 'add-course' : 'add-event';
    const payload = {
      title: form.title,
      description: form.description,
      ...(mode === 'event' && { location: form.location, date: form.date })
    };

    try {
      const res = await fetch(`http://localhost:8000/faculty/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // 🔐 secure token
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert(`${mode === 'course' ? 'Course' : 'Event'} created successfully!`);
        setForm({ title: '', description: '', location: '', date: '' });
      } else {
        alert('Error: ' + (data.detail || 'Something went wrong.'));
      }
    } catch (error) {
      alert('Something went wrong.');
    }
  };

  return (
    <>
      <Header />
      <div className="teacher-dashboard-wrapper">
        <div className="teacher-dashboard-card">
          <h2>➕ Add Course or Event</h2>

          <div style={{ marginBottom: '1rem' }}>
            <button
              className={mode === 'course' ? 'blue-btn' : ''}
              onClick={() => setMode('course')}>Course</button>
            <button
              className={mode === 'event' ? 'blue-btn' : ''}
              onClick={() => setMode('event')}>Event</button>
          </div>

          <input
            type="text"
            name="title"
            placeholder="Title"
            className={errors.title ? 'input-error' : ''}
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <p className="error-text">{errors.title}</p>}

          <textarea
            name="description"
            placeholder="Description"
            className={errors.description ? 'input-error' : ''}
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && <p className="error-text">{errors.description}</p>}

          {mode === 'event' && (
            <>
              <input
                type="text"
                name="location"
                placeholder="Location"
                className={errors.location ? 'input-error' : ''}
                value={form.location}
                onChange={handleChange}
              />
              {errors.location && <p className="error-text">{errors.location}</p>}

              <input
                type="date"
                name="date"
                className={errors.date ? 'input-error' : ''}
                value={form.date}
                onChange={handleChange}
              />
              {errors.date && <p className="error-text">{errors.date}</p>}
            </>
          )}

          <button className="blue-btn" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddCourseEvent;
