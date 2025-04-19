// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

import StudentDashboard from './components/StudentDashboard';
import StudentCourseCatalog from './components/StudentCourseCatalog';
import StudentMyCourses from './components/StudentMyCourses';
import StudentClubs from './components/StudentClubs';
import ClubDetails from './components/ClubDetails';
import StudentEventCatalog from './components/StudentEventCatalog'; // ✅ ADD THIS

import TeacherDashboard from './components/TeacherDashboard';
import MyCourses from './components/MyCourses';
import MyEvents from './components/MyEvents';
import AddCourseEvent from './components/AddCourseEvent';

import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes (with layout + background) */}
        <Route element={<MainLayout />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/my-courses" element={<StudentMyCourses />} />
          <Route path="/courses" element={<StudentCourseCatalog />} />
          <Route path="/student/events" element={<StudentEventCatalog />} /> {/* ✅ NEW */}
          <Route path="/student-clubs" element={<StudentClubs />} />
          <Route path="/club/:id" element={<ClubDetails />} />

          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/my-courses" element={<MyCourses />} />
          <Route path="/teacher/my-events" element={<MyEvents />} />
          <Route path="/teacher/add" element={<AddCourseEvent />} />

          <Route path="/admin-dashboard" element={<div>Admin Dashboard (Coming Soon)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
