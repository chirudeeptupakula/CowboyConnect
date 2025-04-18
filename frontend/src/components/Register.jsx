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
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    console.log("Registration Submitted:", form);
    alert("Registration Successful!");
    navigate('/');
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

          <button className="blue-btn" onClick={handleRegister}>Register</button>
          <button className="blue-btn" onClick={() => navigate('/')}>Back to Login</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
