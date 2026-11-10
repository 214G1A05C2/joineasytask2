# 🎓 Joineazy – Student, Group & Assignment Management System

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.28.2-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Joineazy** is a modern, responsive, SaaS-style university productivity and course administration platform. It enables professors to administer courses, publish individual/group assignments with OneDrive links, and audit live student submissions with exact timestamps. Concurrently, it empowers students to form collaborative groups, manage team rosters, and acknowledge individual and group deliverables.

---

## 🌟 Key Features

### 🔐 1. Authentication & Role-Based Access Control
- **Two First-Class Roles:** Student and Professor with distinct interfaces and protected routes.
- **Simulated JWT Session Token:** Stored in `localStorage` with automated session restoration on refresh.
- **Inline Validation:** Validates required fields, email formatting, minimum password length (>= 6 characters), and matching password confirmation.
- **Pre-Seeded Demo Accounts:** Ready-to-use accounts for instant evaluation.
- **1-Click Demo Fill:** Fast-fill buttons on Login page and 1-click role switcher in the navigation bar.

### 👨‍🏫 2. Professor Features
- **Comprehensive Dashboard:** Real-time dynamic metrics for total courses, total assignments, enrolled students, completed submissions, and pending submissions.
- **Interactive Visual Analytics:** Course submission breakdown powered by Recharts.
- **Assignment Management (CRUD):**
  - Create, view, edit, and delete assignments with modal confirmation dialogs.
  - Fields: Title, Description, Deadline (date & time), OneDrive Repository URL, and Submission Type (Individual vs. Group).
  - Search by assignment title/description.
  - Filter by submission status (All, Active, Past Deadline/Overdue) and sort by newest or earliest deadline.
  - Live progress metrics (e.g. *Submitted: 8 / 12 groups (67%), Pending: 4 groups*).
- **Submission Tracking Center:**
  - Audit view for both Individual and Group deliverables.
  - **Individual Tasks:** View every enrolled student, email, status (Submitted / Pending), and exact acknowledgement timestamp.
  - **Group Deliverables:** View each registered group, leader, member roster, status, submission timestamp, and acknowledging leader.
  - Search by student/group/leader name, filter by status, and inspect modal logs.

### 👨‍🎓 3. Student Features
- **Personalized Student Dashboard:** Metric cards for enrolled courses, total deliverables, completed tasks, pending tasks, overdue count, and overall completion rate.
- **Course Assignment Portal:**
  - View assignments categorized by course.
  - Shows deadline, time remaining or overdue indicator, description, and direct OneDrive repository link.
  - **Individual Assignments:** "Yes, I have submitted" button triggers a confirmation dialog, recording an acknowledgement timestamp. Once submitted, prevents duplicate submissions and displays *"Submitted on [Date & Time]"*.
  - **Group Assignments:**
    - If student is **not** in a group: displays the exact message:  
      > *"You are not part of any group. Create or join one to submit this assignment."*  
      with a direct action button: **"Create or Join Group"**.
    - If student is the **Group Leader**: displays *"Yes, I have submitted (as Group Leader)"*. Submitting records acknowledgement on behalf of all group members.
    - If student is a **Team Member (non-leader)**: displays:  
      > *"Acknowledged by [Leader Name] on [Date and Time]"*  
      (Submission button is hidden for non-leaders).
- **Group Management System:**
  - Form new project groups with automatic group leader assignment.
  - Browse available groups for each course with current member counts and max capacity limits.
  - Join open groups or leave existing groups with clear confirmation modals.
  - Rule enforcement: 1 group per course per student, max group size limits, and leader reassignment on exit.

---

## 🔑 Demo Credentials

| Role | Email | Password | Pre-configured Data |
| :--- | :--- | :--- | :--- |
| **Professor** | `professor@joineazy.com` | `Professor@123` | Dr. Alistair Vance (3 Courses, multiple assignments & submissions) |
| **Student** | `student@joineazy.com` | `Student@123` | Alex Rivera (Leader of *Alpha Devs* in CS401; Member in CS301; Unassigned in CS201 to test group join flow) |
| **Student 2** | `sarah.chen@joineazy.com` | `Student@123` | Sarah Chen (Leader of *SQL Wizards* in CS301; Member in CS401) |
| **Student 3** | `marcus.johnson@joineazy.com` | `Student@123` | Marcus Johnson (Member of *Alpha Devs* in CS401) |
| **Student 4** | `priya.patel@joineazy.com` | `Student@123` | Priya Patel (Leader of *ByteCrafters* in CS401) |

*Tip: You can use the "Quick Demo Fill" buttons on the Login page or the "Switch Demo" button in the top navigation bar to swap between roles seamlessly.*

---

## 🛠️ Technology Stack

- **Frontend Library:** React 18 (Functional components & Hooks)
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 3 with custom color tokens
- **Routing:** React Router DOM 6 (Nested routes, Role guards, Redirects)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Data Visualization:** Recharts
- **State Management:** React Context API (`AuthContext`, `DataContext`)
- **Persistence Layer:** `localStorage` with initial seed database and reset capability

---

## 📁 Project Structure

```text
joineasytask2/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx            # Reusable status badges
│   │   │   │   ├── Button.jsx           # Button variants with loading state
│   │   │   │   ├── Card.jsx             # SaaS card components
│   │   │   │   ├── ConfirmDialog.jsx    # Action confirmation dialogs
│   │   │   │   ├── EmptyState.jsx       # State placeholders
│   │   │   │   ├── Modal.jsx            # Accessible dialog wrapper
│   │   │   │   ├── ProgressBar.jsx      # Colored progress bars
│   │   │   │   ├── SkeletonLoader.jsx   # Loading state skeletons
│   │   │   │   └── StatCard.jsx         # Metric display cards
│   │   │   ├── layout/
│   │   │   │   ├── Breadcrumbs.jsx      # Dynamic breadcrumb navigation
│   │   │   │   ├── DashboardLayout.jsx  # Main shell container
│   │   │   │   ├── Navbar.jsx           # Topbar with demo switch & profile
│   │   │   │   └── Sidebar.jsx          # Responsive collapsible sidebar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Authentication state & session
│   │   │   └── DataContext.jsx          # Centralized reactive mock DB
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── ForgotPassword.jsx   # Password reset screen
│   │   │   │   ├── Login.jsx            # Sign in with 1-click demo fill
│   │   │   │   └── Register.jsx         # Sign up with role selection
│   │   │   ├── common/
│   │   │   │   ├── NotFound.jsx         # 404 handler
│   │   │   │   └── Profile.jsx          # Profile details & DB reset
│   │   │   ├── professor/
│   │   │   │   ├── ProfessorAssignments.jsx  # Assignment CRUD & filters
│   │   │   │   ├── ProfessorCourses.jsx      # Course directory
│   │   │   │   ├── ProfessorDashboard.jsx    # Metrics & charts
│   │   │   │   └── ProfessorSubmissions.jsx  # Individual & group audit
│   │   │   └── student/
│   │   │       ├── StudentAssignments.jsx    # Submission workflows
│   │   │       ├── StudentCourses.jsx        # Enrolled courses
│   │   │       ├── StudentDashboard.jsx      # Progress & upcoming tasks
│   │   │       └── StudentGroups.jsx         # Group formation & joining
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx            # Complete route tree
│   │   │   ├── ProtectedRoute.jsx       # Role-based route guard
│   │   │   └── PublicRoute.jsx          # Auth route redirect
│   │   ├── services/
│   │   │   ├── mockApi.js               # Business logic & CRUD methods
│   │   │   ├── mockData.js              # Seed database
│   │   │   └── storage.js               # Safe localStorage interface
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── vercel.json
├── package.json
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/214G1A05C2/joineasytask2.git
cd joineasytask2
```

### 2. Install dependencies
```bash
cd frontend
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## ☁️ Deployment Guide (Vercel)

This application is fully prepared for one-click deployment on Vercel with SPA routing rules configured.

### Deploying via Vercel Dashboard
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import the `joineasytask2` repository.
4. Configure Build and Output Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (or leave default since root `vercel.json` and `package.json` are pre-configured)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**.

---

## 🎨 Design Decisions

1. **Brand Palette:** Clean Slate-50 background (`#F8FAFC`) with vibrant Indigo/Violet primary accents (`#6366F1`) and Deep Navy text (`#0F172A`) for high contrast and readability.
2. **Instant Evaluation:** Added a persistent "Switch Demo Role" badge and 1-click credential prefill on login to minimize setup friction for graders.
3. **Strict Validation & Feedback:** Every mutation (create assignment, join team, leave group, submit acknowledgement) provides instant toast notifications and confirmation dialogs for destructive actions.
4. **Calculated Statistics:** All dashboard numbers, completion percentages, and progress bars are computed dynamically from actual array lengths and submission timestamps—never hardcoded.
