import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = mockApi.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await mockApi.login(email, password);
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      return res.user;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const res = await mockApi.register(formData);
      setUser(res.user);
      toast.success(`Account created successfully! Welcome, ${res.user.name}`);
      return res.user;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    mockApi.logout();
    setUser(null);
    toast.success('Signed out successfully');
  };

  const forgotPassword = async (email) => {
    try {
      const res = await mockApi.forgotPassword(email);
      toast.success(res.message, { duration: 6000 });
      return res;
    } catch (error) {
      toast.error(error.message || 'Password reset failed');
      throw error;
    }
  };

  // Quick switch between demo accounts for testing & evaluation
  const switchDemoAccount = async (targetRole) => {
    try {
      if (targetRole === 'Professor') {
        return await login('professor@joineazy.com', 'Professor@123');
      } else {
        return await login('student@joineazy.com', 'Student@123');
      }
    } catch (error) {
      toast.error('Could not switch account');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role,
    login,
    register,
    logout,
    forgotPassword,
    switchDemoAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
