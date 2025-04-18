import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import StudentDashboard from './components/StudentDashboard';
import StudentCourseCatalog from './components/StudentCourseCatalog';
import TeacherDashboard from './components/TeacherDashboard';
import MyCourses from './components/MyCourses';
import MyEvents from './components/MyEvents';
import AddCourseEvent from './components/AddCourseEvent';
import StudentMyCourses from './components/StudentMyCourses';



// (Optional) import dashboards here when ready

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/my-courses" element={<StudentMyCourses />} />
        <Route path="/courses" element={<StudentCourseCatalog />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="/teacher/my-courses" element={<MyCourses />} />
        <Route path="/teacher/my-events" element={<MyEvents />} />
        <Route path="/teacher/add" element={<AddCourseEvent />} />

      </Routes>
    </Router>
  );
}

export default App;
