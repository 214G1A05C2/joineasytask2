import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import {
  BookOpen,
  ClipboardList,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  ExternalLink,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';

export const ProfessorDashboard = () => {
  const { user } = useAuth();
  const { courses, assignments, getProfessorDashboardStats, getCourseStats } = useData();
  const navigate = useNavigate();

  const stats = getProfessorDashboardStats(user?.id);
  const profCourses = courses.filter((c) => c.professorId === user?.id);

  // Prepare chart data: submissions per course
  const chartData = profCourses.map((course) => {
    const courseStats = getCourseStats(course.id);
    return {
      name: course.code,
      fullName: course.name,
      assignments: courseStats.totalAssignments,
      completionRate: courseStats.completionRate,
    };
  });

  const COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-8 shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold backdrop-blur-md mb-3 border border-indigo-400/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Academic Term: Spring 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Professor'}!
            </h1>
            <p className="mt-1 text-sm text-indigo-200/90 max-w-xl">
              Track student submissions, organize collaborative group projects, and manage your course milestones from one unified console.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => navigate('/professor/assignments?action=create')}
              className="bg-indigo-500 hover:bg-indigo-400 text-white border-0 shadow-lg shadow-indigo-600/30"
              icon={Plus}
            >
              Create Assignment
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/professor/submissions')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
              icon={CheckCircle2}
            >
              View Submissions
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          subtitle="Active this semester"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Total Assignments"
          value={stats.totalAssignments}
          subtitle="Individual & Group"
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          title="Enrolled Students"
          value={stats.totalStudents}
          subtitle="Across all courses"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          subtitle="Acknowledged work"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Submissions"
          value={stats.pendingSubmissions}
          subtitle="Awaiting submission"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Course Cards & Analytics Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Course Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Active Courses</h2>
              <p className="text-xs text-slate-500">
                Direct access to assignments, enrollment and submissions
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/professor/courses')}
              icon={ArrowRight}
              iconPosition="right"
            >
              View All Courses
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profCourses.map((course, idx) => {
              const courseStats = getCourseStats(course.id);
              return (
                <Card key={course.id} hover className="overflow-hidden flex flex-col justify-between">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {course.code}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-2">
                          {course.name}
                        </h3>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {course.credits} Credits
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block">Enrolled Students</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {courseStats.enrolledStudents} Students
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Assignments</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {courseStats.totalAssignments} Tasks
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ProgressBar
                        value={courseStats.completionRate}
                        showLabel
                        labelPrefix="Overall Completion"
                        color={idx % 2 === 0 ? 'indigo' : 'blue'}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      {courseStats.completionRate}% Submitted
                    </span>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/professor/assignments?course=${course.id}`)}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      View Course
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Col: Course Completion Analytics */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Submission Analytics</h2>
            <p className="text-xs text-slate-500">Completion rate % by course</p>
          </div>

          <Card className="p-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} unit="%" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg">
                            <p className="font-semibold">{payload[0].payload.fullName}</p>
                            <p className="text-indigo-300 mt-1">
                              Completion Rate: {payload[0].value}%
                            </p>
                            <p className="text-slate-400">
                              Assignments: {payload[0].payload.assignments}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="completionRate" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Live Dynamic Calculation
              </span>
              <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => navigate('/professor/submissions')}>
                Deep Dive &rarr;
              </span>
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
              Professor Quick Guide
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>Create individual or group assignments with OneDrive submission links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>Track student and group acknowledgements in real time with exact timestamps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>Filter assignments by status, course, and upcoming or overdue deadlines.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
