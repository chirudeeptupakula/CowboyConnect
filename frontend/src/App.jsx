import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
// (Optional) import dashboards here when ready

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Example dashboard routes */}
        <Route path="/student-dashboard" element={<div>Student Dashboard</div>} />
        <Route path="/teacher-dashboard" element={<div>Teacher Dashboard</div>} />
        <Route path="/admin-dashboard" element={<div>Admin Dashboard</div>} />
      </Routes>
    </Router>
  );
}

export default App;
