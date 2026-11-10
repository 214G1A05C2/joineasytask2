import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { GraduationCap, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const homePath = user
    ? role === 'Professor'
      ? '/professor/dashboard'
      : '/student/dashboard'
    : '/login';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 ring-8 ring-indigo-50/50">
        <GraduationCap className="w-8 h-8" />
      </div>

      <span className="text-6xl sm:text-7xl font-extrabold text-indigo-600 tracking-tight">
        404
      </span>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)} icon={ArrowLeft}>
          Go Back
        </Button>
        <Link to={homePath}>
          <Button icon={Home}>Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};
