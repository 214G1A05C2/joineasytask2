// Initial mock seed data for Joineazy
export const SEED_USERS = [
  {
    id: 'user_prof_1',
    name: 'Dr. Alistair Vance',
    email: 'professor@joineazy.com',
    password: 'Professor@123',
    role: 'Professor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Professor of Computer Science',
    department: 'School of Computing & Data Science',
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'user_stud_1',
    name: 'Alex Rivera',
    email: 'student@joineazy.com',
    password: 'Student@123',
    role: 'Student',
    rollNumber: 'CS21B001',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    createdAt: '2026-01-15T09:30:00.000Z'
  },
  {
    id: 'user_stud_2',
    name: 'Sarah Chen',
    email: 'sarah.chen@joineazy.com',
    password: 'Student@123',
    role: 'Student',
    rollNumber: 'CS21B002',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'user_stud_3',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@joineazy.com',
    password: 'Student@123',
    role: 'Student',
    rollNumber: 'CS21B003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    createdAt: '2026-01-16T11:15:00.000Z'
  },
  {
    id: 'user_stud_4',
    name: 'Priya Patel',
    email: 'priya.patel@joineazy.com',
    password: 'Student@123',
    role: 'Student',
    rollNumber: 'CS21B004',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    createdAt: '2026-01-16T12:00:00.000Z'
  },
  {
    id: 'user_stud_5',
    name: 'Liam Smith',
    email: 'liam.smith@joineazy.com',
    password: 'Student@123',
    role: 'Student',
    rollNumber: 'CS21B005',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    createdAt: '2026-01-17T14:20:00.000Z'
  },
  {
    id: 'user_stud_6',
    name: 'Emma Watson',
    email: 'emma.watson@joineazy.com',
    password: 'Student@123',
    role: 'Student',
    rollNumber: 'CS21B006',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: '6th Semester',
    createdAt: '2026-01-17T15:00:00.000Z'
  }
];

export const SEED_COURSES = [
  {
    id: 'course_cs401',
    name: 'Web Development',
    code: 'CS401',
    description: 'Modern full-stack web applications, React, RESTful APIs, and responsive UI design patterns.',
    term: 'Spring 2026',
    credits: 4,
    color: 'from-indigo-500 to-purple-600',
    professorId: 'user_prof_1',
    professorName: 'Dr. Alistair Vance',
    studentIds: [
      'user_stud_1',
      'user_stud_2',
      'user_stud_3',
      'user_stud_4',
      'user_stud_5',
      'user_stud_6'
    ],
    maxGroupSize: 4
  },
  {
    id: 'course_cs201',
    name: 'Data Structures',
    code: 'CS201',
    description: 'Fundamental data structures, asymptotic algorithmic complexity, trees, graphs, and hashing techniques.',
    term: 'Spring 2026',
    credits: 4,
    color: 'from-blue-500 to-cyan-600',
    professorId: 'user_prof_1',
    professorName: 'Dr. Alistair Vance',
    studentIds: [
      'user_stud_1',
      'user_stud_2',
      'user_stud_3',
      'user_stud_4',
      'user_stud_5'
    ],
    maxGroupSize: 3
  },
  {
    id: 'course_cs301',
    name: 'Database Management Systems',
    code: 'CS301',
    description: 'Relational database design, SQL querying, transaction management, indexing, and NoSQL models.',
    term: 'Spring 2026',
    credits: 3,
    color: 'from-emerald-500 to-teal-600',
    professorId: 'user_prof_1',
    professorName: 'Dr. Alistair Vance',
    studentIds: [
      'user_stud_1',
      'user_stud_2',
      'user_stud_3',
      'user_stud_4',
      'user_stud_6'
    ],
    maxGroupSize: 4
  }
];

export const SEED_GROUPS = [
  {
    id: 'group_cs401_1',
    courseId: 'course_cs401',
    name: 'Alpha Devs',
    leaderId: 'user_stud_1', // Alex Rivera is the leader
    leaderName: 'Alex Rivera',
    memberIds: ['user_stud_1', 'user_stud_2', 'user_stud_3'],
    maxSize: 4,
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'group_cs401_2',
    courseId: 'course_cs401',
    name: 'ByteCrafters',
    leaderId: 'user_stud_4', // Priya Patel
    leaderName: 'Priya Patel',
    memberIds: ['user_stud_4', 'user_stud_5'],
    maxSize: 4,
    createdAt: '2026-02-02T14:30:00.000Z'
  },
  {
    id: 'group_cs301_1',
    courseId: 'course_cs301',
    name: 'SQL Wizards',
    leaderId: 'user_stud_2', // Sarah Chen
    leaderName: 'Sarah Chen',
    memberIds: ['user_stud_2', 'user_stud_1', 'user_stud_6'],
    maxSize: 4,
    createdAt: '2026-02-03T11:00:00.000Z'
  }
  // Notice in course_cs201, Alex Rivera is NOT in any group initially, so we can test the exact requirement!
];

export const SEED_ASSIGNMENTS = [
  {
    id: 'assign_web_1',
    courseId: 'course_cs401',
    title: 'React Dashboard Development',
    description: 'Build a production-quality responsive university dashboard in React with Tailwind CSS, state management, and real-time interaction feedback.',
    deadline: '2026-11-25T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?cid=sample-cs401-react-dashboard',
    submissionType: 'Group',
    createdAt: '2026-10-15T10:00:00.000Z'
  },
  {
    id: 'assign_web_2',
    courseId: 'course_cs401',
    title: 'CSS Grid & Flexbox Portfolio',
    description: 'Craft an accessible, mobile-first portfolio website with complex CSS grid layouts, smooth animations, and dark mode support.',
    deadline: '2026-11-30T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?cid=sample-cs401-portfolio',
    submissionType: 'Individual',
    createdAt: '2026-10-20T14:00:00.000Z'
  },
  {
    id: 'assign_web_3',
    courseId: 'course_cs401',
    title: 'JavaScript Async & Fetch API Lab',
    description: 'Implement asynchronous data fetching with promises, async/await, error handling, retry logic, and client-side pagination.',
    deadline: '2026-10-31T23:59:00.000Z', // Overdue
    oneDriveLink: 'https://onedrive.live.com/?cid=sample-cs401-js-async',
    submissionType: 'Individual',
    createdAt: '2026-10-01T09:00:00.000Z'
  },
  {
    id: 'assign_ds_1',
    courseId: 'course_cs201',
    title: 'Binary Search Tree & AVL Rotations',
    description: 'Implement an AVL self-balancing search tree in C++ or Java with full insertion, rebalancing rotations, and deletion methods.',
    deadline: '2026-11-20T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?cid=sample-cs201-avl-tree',
    submissionType: 'Individual',
    createdAt: '2026-10-10T11:00:00.000Z'
  },
  {
    id: 'assign_ds_2',
    courseId: 'course_cs201',
    title: 'Graph Traversal & Shortest Path Engine',
    description: 'Implement Dijkstra and A* pathfinding algorithms on road network graph datasets with execution benchmark analysis.',
    deadline: '2026-12-05T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?cid=sample-cs201-graphs',
    submissionType: 'Group',
    createdAt: '2026-10-18T16:00:00.000Z'
  },
  {
    id: 'assign_db_1',
    courseId: 'course_cs301',
    title: 'Relational Schema Normalization (3NF/BCNF)',
    description: 'Analyze an enterprise unnormalized relational dataset and derive functional dependencies, candidate keys, and lossless BCNF decomposition.',
    deadline: '2026-11-18T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?cid=sample-cs301-normalization',
    submissionType: 'Individual',
    createdAt: '2026-10-12T08:30:00.000Z'
  },
  {
    id: 'assign_db_2',
    courseId: 'course_cs301',
    title: 'Distributed Transaction & Sharding Benchmark',
    description: 'Design a high-throughput distributed database schema with sharding keys and simulate two-phase commit protocol under network partitions.',
    deadline: '2026-12-10T23:59:00.000Z',
    oneDriveLink: 'https://onedrive.live.com/?cid=sample-cs301-sharding',
    submissionType: 'Group',
    createdAt: '2026-10-22T13:00:00.000Z'
  }
];

export const SEED_SUBMISSIONS = [
  // Individual submission for CS401 JavaScript Async Lab: Alex Rivera submitted
  {
    id: 'sub_1',
    assignmentId: 'assign_web_3',
    courseId: 'course_cs401',
    submissionType: 'Individual',
    studentId: 'user_stud_1', // Alex Rivera
    studentName: 'Alex Rivera',
    studentEmail: 'student@joineazy.com',
    acknowledgedBy: 'Alex Rivera',
    acknowledgedAt: '2026-10-28T18:45:00.000Z'
  },
  // Individual submission for CS401 JavaScript Async Lab: Sarah Chen submitted
  {
    id: 'sub_2',
    assignmentId: 'assign_web_3',
    courseId: 'course_cs401',
    submissionType: 'Individual',
    studentId: 'user_stud_2',
    studentName: 'Sarah Chen',
    studentEmail: 'sarah.chen@joineazy.com',
    acknowledgedBy: 'Sarah Chen',
    acknowledgedAt: '2026-10-29T14:20:00.000Z'
  },
  // Individual submission for CS201 AVL Tree: Sarah Chen submitted
  {
    id: 'sub_3',
    assignmentId: 'assign_ds_1',
    courseId: 'course_cs201',
    submissionType: 'Individual',
    studentId: 'user_stud_2',
    studentName: 'Sarah Chen',
    studentEmail: 'sarah.chen@joineazy.com',
    acknowledgedBy: 'Sarah Chen',
    acknowledgedAt: '2026-11-05T09:15:00.000Z'
  },
  // Group submission for CS301 Sharding: Group "SQL Wizards" submitted by Leader Sarah Chen
  {
    id: 'sub_4',
    assignmentId: 'assign_db_2',
    courseId: 'course_cs301',
    submissionType: 'Group',
    groupId: 'group_cs301_1',
    groupName: 'SQL Wizards',
    leaderId: 'user_stud_2',
    acknowledgedBy: 'Sarah Chen',
    acknowledgedAt: '2026-11-08T16:30:00.000Z'
  }
];
