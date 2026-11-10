import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { GraduationCap, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setSuccess(res.message);
    } catch (err) {
      setError(err.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we'll send you recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-200/80">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Check Your Email</h3>
              <p className="mt-2 text-xs text-slate-600 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                {success}
              </p>
              <div className="mt-6">
                <Link to="/login">
                  <Button className="w-full">Return to Sign In</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="e.g. professor@joineazy.com"
                    className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                      error ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                    }`}
                  />
                </div>
                {error && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-2.5 text-sm font-semibold shadow-md shadow-indigo-600/25"
              >
                Send Reset Link
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
