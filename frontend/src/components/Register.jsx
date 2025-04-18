import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    department: '',
    username: '',
    password: '',
    role: 'student'  // ✅ Default role
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          username: form.username,
          password: form.password,
          department: form.department,
          role: form.role  // ✅ Include role
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        navigate('/');
      } else {
        console.error("Registration Error:", data);
        alert("Error: " + (data.detail || "Registration failed"));
      }
    } catch (error) {
      console.error("Register Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-container">
          <h2>Create Account</h2>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* ✅ Optional: let user select role (student/faculty/admin) */}
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>

          <button className="blue-btn" onClick={handleRegister}>Register</button>
          <button className="blue-btn" onClick={() => navigate('/')}>Back to Login</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
