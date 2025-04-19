import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Store session-like data
        localStorage.setItem("username", data.username);
        localStorage.setItem("userRole", data.role);

        // ✅ Navigate based on role from backend
        if (data.role === 'admin') navigate('/admin-dashboard');
        else if (data.role === 'faculty') navigate('/teacher-dashboard');
        else navigate('/student-dashboard');
      } else {
        alert("Login failed: " + data.detail);
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <Header />

      <div className="login-page">
        <div className="login-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="blue-btn" onClick={handleLogin}>Login</button>
          <button className="blue-btn" onClick={() => navigate('/register')}>Register</button>
          <button className="blue-btn" onClick={() => alert("Forgot Password coming soon!")}>Forgot Password?</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
