import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  User,
  Mail,
  Shield,
  GraduationCap,
  Sparkles,
  RotateCcw,
  LogOut,
  Key,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, role, logout, switchDemoAccount } = useAuth();
  const { resetToSeed, courses } = useData();
  const navigate = useNavigate();

  const handleSwitch = async () => {
    const target = role === 'Professor' ? 'Student' : 'Professor';
    await switchDemoAccount(target);
    navigate(target === 'Professor' ? '/professor/dashboard' : '/student/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userCourses = courses.filter((c) =>
    role === 'Professor' ? c.professorId === user?.id : c.studentIds?.includes(user?.id)
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          User Profile & Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your account profile, role preferences, and simulation settings
        </p>
      </div>

      {/* Main Profile Info Card */}
      <Card className="overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
            />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <Badge variant={role === 'Professor' ? 'purple' : 'info'} size="md">
                  {role} Account
                </Badge>
              </div>

              <p className="text-sm text-indigo-200">
                {user?.department || 'Computer Science & Engineering'}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
                {user?.rollNumber && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> ID: {user?.rollNumber}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Session
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardBody className="p-6 sm:p-8 space-y-6">
          {/* Account Details Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Account Metadata
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Full Name:</span>
                <span className="font-semibold text-slate-800 text-sm">{user?.name}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Email Address:</span>
                <span className="font-semibold text-slate-800 text-sm">{user?.email}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Assigned Role:</span>
                <span className="font-semibold text-slate-800 text-sm">{role}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-1">Associated Courses:</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {userCourses.length} active courses
                </span>
              </div>
            </div>
          </div>

          {/* Quick Evaluator Controls (Switch Account & Reset) */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Evaluator Quick Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Quick Role Toggle
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Instantly swap to the {role === 'Professor' ? 'Student' : 'Professor'} demo account without typing credentials.
                  </p>
                </div>
                <Button size="sm" onClick={handleSwitch}>
                  Switch to {role === 'Professor' ? 'Student' : 'Professor'}
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-slate-600" />
                    Reset Mock Database
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Reset all courses, submissions, and groups in localStorage back to the fresh seed data.
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={resetToSeed}>
                  Reset Database
                </Button>
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button variant="danger" onClick={handleLogout} icon={LogOut}>
              Sign Out of Joineazy
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
