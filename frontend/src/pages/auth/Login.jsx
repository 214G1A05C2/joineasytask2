import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { GraduationCap, Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login(email, password);
      const redirectPath =
        location.state?.from?.pathname ||
        (user.role === 'Professor' ? '/professor/dashboard' : '/student/dashboard');
      navigate(redirectPath, { replace: true });
    } catch (err) {
      // Handled in AuthContext toast
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'Professor') {
      setEmail('professor@joineazy.com');
      setPassword('Professor@123');
    } else {
      setEmail('student@joineazy.com');
      setPassword('Student@123');
    }
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Sign in to Joineazy
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Student, Group & Assignment Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-200/80">
          {/* Quick Demo Credentials Fill Pills */}
          <div className="mb-6 p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100/80">
            <p className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Quick Demo Fill (Instant Testing):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('Professor')}
                className="py-1.5 px-3 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-medium rounded-xl border border-indigo-200 transition-colors shadow-2xs text-center"
              >
                Professor Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('Student')}
                className="py-1.5 px-3 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-medium rounded-xl border border-indigo-200 transition-colors shadow-2xs text-center"
              >
                Student Demo
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@joineazy.com"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                    errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="w-full py-2.5 text-sm font-semibold shadow-md shadow-indigo-600/25"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
