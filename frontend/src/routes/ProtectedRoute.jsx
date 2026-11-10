import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading Joineazy...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    toast.error(`Unauthorized access. You cannot access ${allowedRoles.join('/')} pages as a ${role}.`);
    const fallback = role === 'Professor' ? '/professor/dashboard' : '/student/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
};
