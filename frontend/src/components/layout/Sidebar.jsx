import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  Users2,
  ClipboardList,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { user, logout, role } = useAuth();
  const { courses } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isProf = role === 'Professor';

  const professorNav = [
    { name: 'Dashboard', path: '/professor/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/professor/courses', icon: BookOpen },
    { name: 'Assignments', path: '/professor/assignments', icon: ClipboardList },
    { name: 'Submission Tracking', path: '/professor/submissions', icon: FileCheck2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const studentNav = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/student/courses', icon: BookOpen },
    { name: 'Assignments', path: '/student/assignments', icon: ClipboardList },
    { name: 'My Groups', path: '/student/groups', icon: Users2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const navItems = isProf ? professorNav : studentNav;

  // Filter courses relevant to current user
  const userCourses = isProf
    ? courses.filter(c => c.professorId === user?.id)
    : courses.filter(c => c.studentIds?.includes(user?.id));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                Joineazy
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-indigo-600 -mt-0.5">
                Campus OS
              </span>
            </div>
          </div>
          <Badge variant={isProf ? 'purple' : 'info'} size="sm">
            {role || 'User'}
          </Badge>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Main Navigation */}
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Menu
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-600 font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-5 h-5 shrink-0 ${
                            isActive ? 'text-indigo-600' : 'text-slate-400'
                          }`}
                        />
                        <span className="flex-1">{item.name}</span>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Enrolled Courses Quick Access */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Courses
              </p>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {userCourses.length}
              </span>
            </div>
            <div className="space-y-1">
              {userCourses.map((c) => (
                <NavLink
                  key={c.id}
                  to={isProf ? `/professor/assignments?course=${c.id}` : `/student/assignments?course=${c.id}`}
                  onClick={closeMobileSidebar}
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="font-semibold text-slate-700">{c.code}</span>
                    <span className="text-slate-500 truncate">{c.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* User Card & Logout Bottom */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
