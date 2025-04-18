import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const getRoleByUsername = (username) => {
    const uname = username.toLowerCase();
    if (uname === 'admin1' || uname === 'admin2') return 'admin';
    if (uname.startsWith('t_')) return 'teacher';
    return 'student';
  };

  const handleLogin = () => {
    const role = getRoleByUsername(username);
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', username);

    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else if (role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  return (
    <>
      <Header />
      <div
        className="login-page"
        style={{
          backgroundImage: `url('/Background_login.png')`, // from public folder
        }}
      >
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
