import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// Layout
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Professor Pages
import { ProfessorDashboard } from '../pages/professor/ProfessorDashboard';
import { ProfessorCourses } from '../pages/professor/ProfessorCourses';
import { ProfessorAssignments } from '../pages/professor/ProfessorAssignments';
import { ProfessorSubmissions } from '../pages/professor/ProfessorSubmissions';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentCourses } from '../pages/student/StudentCourses';
import { StudentAssignments } from '../pages/student/StudentAssignments';
import { StudentGroups } from '../pages/student/StudentGroups';

// Common Pages
import { Profile } from '../pages/common/Profile';
import { NotFound } from '../pages/common/NotFound';

const RootRedirect = () => {
  const { user, isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={role === 'Professor' ? '/professor/dashboard' : '/student/dashboard'}
      replace
    />
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Protected Dashboard Routes with Shared Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Common Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Professor Only Routes */}
        <Route
          path="/professor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Professor']}>
              <ProfessorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/courses"
          element={
            <ProtectedRoute allowedRoles={['Professor']}>
              <ProfessorCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/assignments"
          element={
            <ProtectedRoute allowedRoles={['Professor']}>
              <ProfessorAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/submissions"
          element={
            <ProtectedRoute allowedRoles={['Professor']}>
              <ProfessorSubmissions />
            </ProtectedRoute>
          }
        />

        {/* Student Only Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/groups"
          element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentGroups />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
