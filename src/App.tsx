import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminCourses } from './pages/admin/Courses';
import { AdminUsers } from './pages/admin/Users';
import { AdminClasses } from './pages/admin/Classes';
import { ProfessorDashboard } from './pages/professor/Dashboard';
import { ProfessorClassRoom } from './pages/professor/ClassRoom';
import { StudentDashboard } from './pages/student/Dashboard';

import { useEffect } from 'react';
import { useAcademicStore } from './store/academicStore';

function App() {
  const fetchData = useAcademicStore(state => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Outlet />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="classes" element={<AdminClasses />} />
          </Route>

          {/* Professor Routes */}
          <Route path="professor" element={
            <ProtectedRoute allowedRoles={['professor']}>
              <Outlet />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<ProfessorDashboard />} />
            <Route path="class/:classId" element={<ProfessorClassRoom />} />
          </Route>

          {/* Student Routes */}
          <Route path="student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Outlet />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StudentDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
