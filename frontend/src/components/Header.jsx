import './Header.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const username = localStorage.getItem('username');
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ❌ Hide pill on login or register pages
  const hidePill = location.pathname === '/' || location.pathname === '/register';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="header">
      <h1 className="header-title">Cowboy Connect</h1>

      {!hidePill && username && (
        <div className="user-pill-wrapper">
          <div className="user-pill" onClick={() => setDropdownOpen(!dropdownOpen)}>
            👤 {username}
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div onClick={() => navigate('/profile')}>View Profile</div>
              <div onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
