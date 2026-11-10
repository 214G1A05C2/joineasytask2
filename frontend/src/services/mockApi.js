import { getStorageItem, setStorageItem, STORAGE_KEYS, initializeDatabase } from './storage';

// Ensure DB is initialized before any call
initializeDatabase();

// Helper to simulate network latency if needed, or return immediately
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // ================= AUTH API =================
  login: async (email, password) => {
    await delay(150);
    const users = getStorageItem(STORAGE_KEYS.USERS, []);
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new Error('User not found. Please check your email or register.');
    }
    if (user.password !== password) {
      throw new Error('Invalid password. Please check your credentials.');
    }

    // Simulated JWT token
    const token = `jwt_session_${user.id}_${Date.now()}`;
    const sessionData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        rollNumber: user.rollNumber,
        department: user.department,
        title: user.title,
      },
      token
    };

    setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, sessionData.user);
    return sessionData;
  },

  register: async ({ name, email, password, role }) => {
    await delay(150);
    const users = getStorageItem(STORAGE_KEYS.USERS, []);
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `user_${role.toLowerCase().slice(0, 4)}_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role, // 'Student' or 'Professor'
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      rollNumber: role === 'Student' ? `CS26B${Math.floor(100 + Math.random() * 900)}` : undefined,
      department: 'Computer Science & Engineering',
      title: role === 'Professor' ? 'Assistant Professor' : undefined,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setStorageItem(STORAGE_KEYS.USERS, users);

    // If new student, auto-enroll in sample courses for instant evaluation
    if (role === 'Student') {
      const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
      courses.forEach(c => {
        if (!c.studentIds.includes(newUser.id)) {
          c.studentIds.push(newUser.id);
        }
      });
      setStorageItem(STORAGE_KEYS.COURSES, courses);
    }

    const token = `jwt_session_${newUser.id}_${Date.now()}`;
    const sessionData = {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        rollNumber: newUser.rollNumber,
        department: newUser.department,
        title: newUser.title,
      },
      token
    };

    setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, sessionData.user);
    return sessionData;
  },

  forgotPassword: async (email) => {
    await delay(200);
    const users = getStorageItem(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      throw new Error('No account found with this email address.');
    }
    return {
      success: true,
      message: `Password reset instructions have been sent to ${email}. (Demo note: For demo accounts, password is ${user.password})`
    };
  },

  getCurrentUser: () => {
    const token = getStorageItem(STORAGE_KEYS.AUTH_TOKEN);
    const user = getStorageItem(STORAGE_KEYS.CURRENT_USER);
    if (!token || !user) return null;
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // ================= USERS API =================
  getUsers: () => {
    return getStorageItem(STORAGE_KEYS.USERS, []);
  },

  getUserById: (id) => {
    const users = getStorageItem(STORAGE_KEYS.USERS, []);
    return users.find(u => u.id === id) || null;
  },

  // ================= COURSES API =================
  getCourses: () => {
    return getStorageItem(STORAGE_KEYS.COURSES, []);
  },

  getCourseById: (courseId) => {
    const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
    return courses.find(c => c.id === courseId) || null;
  },

  getCoursesForStudent: (studentId) => {
    const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
    return courses.filter(c => c.studentIds && c.studentIds.includes(studentId));
  },

  getCoursesForProfessor: (professorId) => {
    const courses = getStorageItem(STORAGE_KEYS.COURSES, []);
    return courses.filter(c => c.professorId === professorId);
  },

  // ================= ASSIGNMENTS API =================
  getAssignments: () => {
    return getStorageItem(STORAGE_KEYS.ASSIGNMENTS, []);
  },

  getAssignmentsByCourse: (courseId) => {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, []);
    return assignments.filter(a => a.courseId === courseId);
  },

  getAssignmentById: (id) => {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, []);
    return assignments.find(a => a.id === id) || null;
  },

  createAssignment: (data) => {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, []);
    const newAssignment = {
      id: `assign_${Date.now()}`,
      courseId: data.courseId,
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      oneDriveLink: data.oneDriveLink.trim(),
      submissionType: data.submissionType, // 'Individual' or 'Group'
      createdAt: new Date().toISOString()
    };
    assignments.unshift(newAssignment);
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return newAssignment;
  },

  updateAssignment: (id, data) => {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, []);
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    assignments[index] = {
      ...assignments[index],
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      oneDriveLink: data.oneDriveLink.trim(),
      submissionType: data.submissionType,
      updatedAt: new Date().toISOString()
    };
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
    return assignments[index];
  },

  deleteAssignment: (id) => {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, []);
    const filteredAssignments = assignments.filter(a => a.id !== id);
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, filteredAssignments);

    // Also remove associated submissions
    const submissions = getStorageItem(STORAGE_KEYS.SUBMISSIONS, []);
    const filteredSubmissions = submissions.filter(s => s.assignmentId !== id);
    setStorageItem(STORAGE_KEYS.SUBMISSIONS, filteredSubmissions);
    return true;
  },

  // ================= GROUPS API =================
  getGroups: () => {
    return getStorageItem(STORAGE_KEYS.GROUPS, []);
  },

  getGroupsByCourse: (courseId) => {
    const groups = getStorageItem(STORAGE_KEYS.GROUPS, []);
    return groups.filter(g => g.courseId === courseId);
  },

  getStudentGroupForCourse: (studentId, courseId) => {
    const groups = getStorageItem(STORAGE_KEYS.GROUPS, []);
    return groups.find(g => g.courseId === courseId && g.memberIds.includes(studentId)) || null;
  },

  createGroup: ({ name, courseId, leaderId }) => {
    const groups = getStorageItem(STORAGE_KEYS.GROUPS, []);
    const users = getStorageItem(STORAGE_KEYS.USERS, []);
    const course = mockApi.getCourseById(courseId);

    // Check if student already in a group for this course
    const existingGroup = groups.find(g => g.courseId === courseId && g.memberIds.includes(leaderId));
    if (existingGroup) {
      throw new Error(`You are already a member of "${existingGroup.name}" in this course. You cannot join or create multiple groups in the same course.`);
    }

    // Check if group name already exists in this course
    const nameExists = groups.some(g => g.courseId === courseId && g.name.toLowerCase() === name.trim().toLowerCase());
    if (nameExists) {
      throw new Error(`A group with the name "${name.trim()}" already exists in this course.`);
    }

    const leader = users.find(u => u.id === leaderId);
    const newGroup = {
      id: `group_${courseId}_${Date.now()}`,
      courseId,
      name: name.trim(),
      leaderId,
      leaderName: leader ? leader.name : 'Unknown Leader',
      memberIds: [leaderId],
      maxSize: course?.maxGroupSize || 4,
      createdAt: new Date().toISOString()
    };

    groups.push(newGroup);
    setStorageItem(STORAGE_KEYS.GROUPS, groups);
    return newGroup;
  },

  joinGroup: ({ groupId, studentId }) => {
    const groups = getStorageItem(STORAGE_KEYS.GROUPS, []);
    const group = groups.find(g => g.id === groupId);
    if (!group) throw new Error('Group not found');

    // Rule: A student can belong to only one group per course
    const existing = groups.find(g => g.courseId === group.courseId && g.memberIds.includes(studentId));
    if (existing) {
      throw new Error(`You already belong to "${existing.name}" in this course. Leave it before joining another.`);
    }

    // Rule: Max group size
    if (group.memberIds.length >= (group.maxSize || 4)) {
      throw new Error('This group is full and cannot accept more members.');
    }

    group.memberIds.push(studentId);
    setStorageItem(STORAGE_KEYS.GROUPS, groups);
    return group;
  },

  leaveGroup: ({ groupId, studentId }) => {
    const groups = getStorageItem(STORAGE_KEYS.GROUPS, []);
    const groupIndex = groups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) throw new Error('Group not found');

    const group = groups[groupIndex];
    if (!group.memberIds.includes(studentId)) {
      throw new Error('You are not a member of this group.');
    }

    // Remove student
    group.memberIds = group.memberIds.filter(id => id !== studentId);

    // If no members remain, delete group
    if (group.memberIds.length === 0) {
      groups.splice(groupIndex, 1);
    } else if (group.leaderId === studentId) {
      // Reassign leader to the next member
      const users = getStorageItem(STORAGE_KEYS.USERS, []);
      group.leaderId = group.memberIds[0];
      const newLeader = users.find(u => u.id === group.leaderId);
      group.leaderName = newLeader ? newLeader.name : 'Unknown Leader';
    }

    setStorageItem(STORAGE_KEYS.GROUPS, groups);
    return true;
  },

  // ================= SUBMISSIONS API =================
  getSubmissions: () => {
    return getStorageItem(STORAGE_KEYS.SUBMISSIONS, []);
  },

  getSubmissionsByAssignment: (assignmentId) => {
    const submissions = getStorageItem(STORAGE_KEYS.SUBMISSIONS, []);
    return submissions.filter(s => s.assignmentId === assignmentId);
  },

  acknowledgeIndividualSubmission: ({ assignmentId, studentId, studentName, studentEmail }) => {
    const submissions = getStorageItem(STORAGE_KEYS.SUBMISSIONS, []);
    const assignment = mockApi.getAssignmentById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    // Prevent duplicate acknowledgement
    const exists = submissions.some(s => s.assignmentId === assignmentId && s.studentId === studentId);
    if (exists) {
      throw new Error('You have already submitted this assignment.');
    }

    const newSub = {
      id: `sub_${Date.now()}`,
      assignmentId,
      courseId: assignment.courseId,
      submissionType: 'Individual',
      studentId,
      studentName,
      studentEmail,
      acknowledgedBy: studentName,
      acknowledgedAt: new Date().toISOString()
    };

    submissions.push(newSub);
    setStorageItem(STORAGE_KEYS.SUBMISSIONS, submissions);
    return newSub;
  },

  acknowledgeGroupSubmission: ({ assignmentId, groupId, leaderId, leaderName }) => {
    const submissions = getStorageItem(STORAGE_KEYS.SUBMISSIONS, []);
    const assignment = mockApi.getAssignmentById(assignmentId);
    const groups = getStorageItem(STORAGE_KEYS.GROUPS, []);
    const group = groups.find(g => g.id === groupId);

    if (!assignment) throw new Error('Assignment not found');
    if (!group) throw new Error('Group not found');

    // Verification: Only leader can submit
    if (group.leaderId !== leaderId) {
      throw new Error('Only the group leader can acknowledge group submissions.');
    }

    // Check duplicate
    const exists = submissions.some(s => s.assignmentId === assignmentId && s.groupId === groupId);
    if (exists) {
      throw new Error('This group assignment has already been acknowledged.');
    }

    const newSub = {
      id: `sub_${Date.now()}`,
      assignmentId,
      courseId: assignment.courseId,
      submissionType: 'Group',
      groupId,
      groupName: group.name,
      leaderId,
      acknowledgedBy: leaderName,
      acknowledgedAt: new Date().toISOString()
    };

    submissions.push(newSub);
    setStorageItem(STORAGE_KEYS.SUBMISSIONS, submissions);
    return newSub;
  },

  // ================= DYNAMIC STATISTICS & HELPERS =================
  getAssignmentStats: (assignmentId) => {
    const assignment = mockApi.getAssignmentById(assignmentId);
    if (!assignment) return null;

    const course = mockApi.getCourseById(assignment.courseId);
    const submissions = mockApi.getSubmissionsByAssignment(assignmentId);

    if (assignment.submissionType === 'Individual') {
      const totalEnrolled = course?.studentIds?.length || 0;
      const submittedCount = submissions.length;
      const pendingCount = Math.max(0, totalEnrolled - submittedCount);
      const percentage = totalEnrolled > 0 ? Math.round((submittedCount / totalEnrolled) * 100) : 0;
      const isOverdue = new Date(assignment.deadline) < new Date();

      return {
        type: 'Individual',
        totalCount: totalEnrolled,
        submittedCount,
        pendingCount,
        percentage,
        isOverdue,
        unit: 'students'
      };
    } else {
      // Group assignment stats
      const courseGroups = mockApi.getGroupsByCourse(assignment.courseId);
      const totalGroups = courseGroups.length;
      const submittedCount = submissions.length;
      const pendingCount = Math.max(0, totalGroups - submittedCount);
      const percentage = totalGroups > 0 ? Math.round((submittedCount / totalGroups) * 100) : 0;
      const isOverdue = new Date(assignment.deadline) < new Date();

      return {
        type: 'Group',
        totalCount: totalGroups,
        submittedCount,
        pendingCount,
        percentage,
        isOverdue,
        unit: 'groups'
      };
    }
  },

  getCourseStats: (courseId) => {
    const course = mockApi.getCourseById(courseId);
    const assignments = mockApi.getAssignmentsByCourse(courseId);
    const enrolledCount = course?.studentIds?.length || 0;
    
    let totalExpectedSubmissions = 0;
    let actualSubmissions = 0;

    assignments.forEach(assign => {
      const stats = mockApi.getAssignmentStats(assign.id);
      if (stats) {
        totalExpectedSubmissions += stats.totalCount;
        actualSubmissions += stats.submittedCount;
      }
    });

    const completionRate = totalExpectedSubmissions > 0
      ? Math.round((actualSubmissions / totalExpectedSubmissions) * 100)
      : 0;

    return {
      totalAssignments: assignments.length,
      enrolledStudents: enrolledCount,
      completionRate,
      assignments
    };
  },

  getProfessorDashboardStats: (professorId) => {
    const courses = mockApi.getCoursesForProfessor(professorId);
    const courseIds = courses.map(c => c.id);
    const allAssignments = mockApi.getAssignments().filter(a => courseIds.includes(a.courseId));
    
    // Unique enrolled students count across all courses
    const allStudentIds = new Set();
    courses.forEach(c => c.studentIds?.forEach(id => allStudentIds.add(id)));

    let totalSubmissions = 0;
    let totalPending = 0;

    allAssignments.forEach(assign => {
      const stats = mockApi.getAssignmentStats(assign.id);
      if (stats) {
        totalSubmissions += stats.submittedCount;
        totalPending += stats.pendingCount;
      }
    });

    return {
      totalCourses: courses.length,
      totalAssignments: allAssignments.length,
      totalStudents: allStudentIds.size,
      totalSubmissions,
      pendingSubmissions: totalPending,
      courses
    };
  },

  getStudentDashboardStats: (studentId) => {
    const courses = mockApi.getCoursesForStudent(studentId);
    const courseIds = courses.map(c => c.id);
    const allAssignments = mockApi.getAssignments().filter(a => courseIds.includes(a.courseId));
    const allSubmissions = mockApi.getSubmissions();
    const groups = mockApi.getGroups();

    let completedCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    const enrichedAssignments = allAssignments.map(assign => {
      let isSubmitted = false;
      let submissionInfo = null;

      if (assign.submissionType === 'Individual') {
        const sub = allSubmissions.find(s => s.assignmentId === assign.id && s.studentId === studentId);
        if (sub) {
          isSubmitted = true;
          submissionInfo = sub;
        }
      } else {
        // Find student group for this course
        const studentGroup = groups.find(g => g.courseId === assign.courseId && g.memberIds.includes(studentId));
        if (studentGroup) {
          const sub = allSubmissions.find(s => s.assignmentId === assign.id && s.groupId === studentGroup.id);
          if (sub) {
            isSubmitted = true;
            submissionInfo = sub;
          }
        }
      }

      const isOverdue = !isSubmitted && new Date(assign.deadline) < new Date();
      if (isSubmitted) {
        completedCount++;
      } else {
        pendingCount++;
        if (isOverdue) overdueCount++;
      }

      return {
        ...assign,
        isSubmitted,
        submissionInfo,
        isOverdue
      };
    });

    const completionPercentage = allAssignments.length > 0
      ? Math.round((completedCount / allAssignments.length) * 100)
      : 0;

    return {
      enrolledCoursesCount: courses.length,
      totalAssignments: allAssignments.length,
      completedAssignments: completedCount,
      pendingAssignments: pendingCount,
      overdueAssignments: overdueCount,
      completionPercentage,
      courses,
      assignments: enrichedAssignments
    };
  }
};
