import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

// 🎓 Student Components
import StudentDashboard from './components/StudentDashboard';
import StudentCourseCatalog from './components/StudentCourseCatalog';
import StudentMyCourses from './components/StudentMyCourses';
import StudentClubs from './components/StudentClubs';
import ClubDetails from './components/ClubDetails'; // ✅ New component for /club/:id

// 👨‍🏫 Faculty/Teacher Components
import TeacherDashboard from './components/TeacherDashboard';
import MyCourses from './components/MyCourses';
import MyEvents from './components/MyEvents';
import AddCourseEvent from './components/AddCourseEvent';

// 🛠 Admin placeholder

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔐 Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🎓 Student Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/my-courses" element={<StudentMyCourses />} />
        <Route path="/courses" element={<StudentCourseCatalog />} />
        <Route path="/student-clubs" element={<StudentClubs />} />
        <Route path="/club/:id" element={<ClubDetails />} /> {/* ✅ View specific club */}

        {/* 👨‍🏫 Teacher Routes */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/my-courses" element={<MyCourses />} />
        <Route path="/teacher/my-events" element={<MyEvents />} />
        <Route path="/teacher/add" element={<AddCourseEvent />} />

        {/* 🛠 Admin Route */}
        <Route path="/admin-dashboard" element={<div>Admin Dashboard (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
