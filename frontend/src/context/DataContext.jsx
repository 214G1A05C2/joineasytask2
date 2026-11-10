import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockApi } from '../services/mockApi';
import { resetDatabaseToSeed } from '../services/storage';
import toast from 'react-hot-toast';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    try {
      setCourses(mockApi.getCourses());
      setAssignments(mockApi.getAssignments());
      setGroups(mockApi.getGroups());
      setSubmissions(mockApi.getSubmissions());
      setUsers(mockApi.getUsers());
    } catch (err) {
      console.error('Failed to load mock data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Assignment CRUD
  const createAssignment = (data) => {
    try {
      const newAssign = mockApi.createAssignment(data);
      loadData();
      toast.success('Assignment created successfully!');
      return newAssign;
    } catch (err) {
      toast.error(err.message || 'Failed to create assignment');
      throw err;
    }
  };

  const updateAssignment = (id, data) => {
    try {
      const updated = mockApi.updateAssignment(id, data);
      loadData();
      toast.success('Assignment updated successfully!');
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update assignment');
      throw err;
    }
  };

  const deleteAssignment = (id) => {
    try {
      mockApi.deleteAssignment(id);
      loadData();
      toast.success('Assignment deleted successfully');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete assignment');
      throw err;
    }
  };

  // Group actions
  const createGroup = ({ name, courseId, leaderId }) => {
    try {
      const newGrp = mockApi.createGroup({ name, courseId, leaderId });
      loadData();
      toast.success(`Group "${name}" created successfully!`);
      return newGrp;
    } catch (err) {
      toast.error(err.message || 'Failed to create group');
      throw err;
    }
  };

  const joinGroup = ({ groupId, studentId }) => {
    try {
      const updatedGrp = mockApi.joinGroup({ groupId, studentId });
      loadData();
      toast.success(`Successfully joined "${updatedGrp.name}"!`);
      return updatedGrp;
    } catch (err) {
      toast.error(err.message || 'Failed to join group');
      throw err;
    }
  };

  const leaveGroup = ({ groupId, studentId }) => {
    try {
      mockApi.leaveGroup({ groupId, studentId });
      loadData();
      toast.success('You have left the group.');
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to leave group');
      throw err;
    }
  };

  // Submissions
  const acknowledgeIndividual = ({ assignmentId, studentId, studentName, studentEmail }) => {
    try {
      const sub = mockApi.acknowledgeIndividualSubmission({
        assignmentId,
        studentId,
        studentName,
        studentEmail,
      });
      loadData();
      toast.success('Submission acknowledged successfully! 🎉');
      return sub;
    } catch (err) {
      toast.error(err.message || 'Submission acknowledgement failed');
      throw err;
    }
  };

  const acknowledgeGroup = ({ assignmentId, groupId, leaderId, leaderName }) => {
    try {
      const sub = mockApi.acknowledgeGroupSubmission({
        assignmentId,
        groupId,
        leaderId,
        leaderName,
      });
      loadData();
      toast.success('Group submission acknowledged for all members! 🎉');
      return sub;
    } catch (err) {
      toast.error(err.message || 'Group submission acknowledgement failed');
      throw err;
    }
  };

  // Reset database tool
  const resetToSeed = () => {
    resetDatabaseToSeed();
    loadData();
    toast.success('Database reset to fresh demo seed state!');
  };

  const value = {
    courses,
    assignments,
    groups,
    submissions,
    users,
    loading,
    refreshData: loadData,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    createGroup,
    joinGroup,
    leaveGroup,
    acknowledgeIndividual,
    acknowledgeGroup,
    resetToSeed,
    // Helpers
    getAssignmentStats: mockApi.getAssignmentStats,
    getCourseStats: mockApi.getCourseStats,
    getProfessorDashboardStats: mockApi.getProfessorDashboardStats,
    getStudentDashboardStats: mockApi.getStudentDashboardStats,
    getStudentGroupForCourse: mockApi.getStudentGroupForCourse,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
