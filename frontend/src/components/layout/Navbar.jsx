import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Breadcrumbs } from './Breadcrumbs';
import {
  Menu,
  Bell,
  RefreshCw,
  UserCheck,
  User,
  LogOut,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const Navbar = ({ openMobileSidebar }) => {
  const { user, logout, role, switchDemoAccount } = useAuth();
  const { resetToSeed } = useData();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchAccount = async () => {
    const target = role === 'Professor' ? 'Student' : 'Professor';
    await switchDemoAccount(target);
    setProfileOpen(false);
    navigate(target === 'Professor' ? '/professor/dashboard' : '/student/dashboard');
  };

  const notifications = [
    {
      id: 1,
      title: 'Assignment Submitted',
      desc: 'Sarah Chen submitted "CSS Grid Portfolio"',
      time: '15m ago',
      read: false
    },
    {
      id: 2,
      title: 'New Group Formed',
      desc: 'Group "Alpha Devs" registered in CS401',
      time: '1h ago',
      read: true
    },
    {
      id: 3,
      title: 'Upcoming Deadline',
      desc: 'React Dashboard Due in 5 days',
      time: '3h ago',
      read: true
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={openMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumbs />
      </div>

      {/* Right: Actions, Demo Switcher, Notification, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Demo Switcher Pill */}
        <button
          onClick={handleSwitchAccount}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200 shadow-2xs"
          title="Instantly switch between Professor and Student for evaluation"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Switch to {role === 'Professor' ? 'Student' : 'Professor'} Demo</span>
        </button>

        {/* Reset Database Button */}
        <button
          onClick={resetToSeed}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Reset database to fresh seeded state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Reset DB</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">Notifications</span>
                <span className="text-xs text-indigo-600 font-medium cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                      !item.read ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                {user?.name}
              </span>
              <span className="block text-[11px] text-slate-500 leading-tight">
                {role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <div className="mt-2">
                  <Badge variant={role === 'Professor' ? 'purple' : 'info'} size="sm">
                    {role} Account
                  </Badge>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile & Settings
                </button>
                <button
                  onClick={handleSwitchAccount}
                  className="w-full px-4 py-2 text-left text-xs text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                >
                  <UserCheck className="w-4 h-4 text-indigo-500" />
                  Switch to {role === 'Professor' ? 'Student' : 'Professor'}
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
