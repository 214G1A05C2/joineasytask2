import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { GraduationCap, Mail, Lock, User, CheckCircle2, ArrowRight } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student', // default
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      navigate(user.role === 'Professor' ? '/professor/dashboard' : '/student/dashboard', {
        replace: true,
      });
    } catch (err) {
      // Toast displayed by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Join Joineazy to manage your courses, groups, and assignments
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-200/80">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'Student' }))}
                  className={`py-3 px-4 rounded-2xl border text-center font-medium text-xs transition-all flex flex-col items-center gap-1 ${
                    formData.role === 'Student'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-semibold text-sm">Student</span>
                  <span className="text-[11px] text-slate-500">Submit work & join groups</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'Professor' }))}
                  className={`py-3 px-4 rounded-2xl border text-center font-medium text-xs transition-all flex flex-col items-center gap-1 ${
                    formData.role === 'Professor'
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-semibold text-sm">Professor</span>
                  <span className="text-[11px] text-slate-500">Manage courses & track tasks</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Rivera"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                    errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@joineazy.com"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                    errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                    errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                    errors.confirmPassword ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="w-full py-2.5 mt-2 text-sm font-semibold shadow-md shadow-indigo-600/25"
              icon={ArrowRight}
              iconPosition="right"
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 text-center pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
