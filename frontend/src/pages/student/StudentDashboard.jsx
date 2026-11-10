import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import {
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users2,
  ExternalLink,
  Flame
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const {
    courses,
    getStudentDashboardStats,
    getCourseStats,
  } = useData();
  const navigate = useNavigate();

  const stats = getStudentDashboardStats(user?.id);
  const enrolledCourses = courses.filter((c) => c.studentIds?.includes(user?.id));

  // Pie chart data for student submission breakdown
  const pieData = [
    { name: 'Completed', value: stats.completedAssignments, color: '#10B981' },
    { name: 'Pending', value: stats.pendingAssignments - stats.overdueAssignments, color: '#6366F1' },
    { name: 'Overdue', value: stats.overdueAssignments, color: '#F43F5E' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-8 shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold backdrop-blur-md mb-3 border border-indigo-400/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Student Portal • {user?.rollNumber || 'CS21B001'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="mt-1 text-sm text-indigo-200/90 max-w-xl">
              Track course deliverables, collaborate with your project group, and submit your assignment acknowledgements effortlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => navigate('/student/assignments')}
              className="bg-indigo-500 hover:bg-indigo-400 text-white border-0 shadow-lg shadow-indigo-600/30"
              icon={ClipboardList}
            >
              My Assignments
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/student/groups')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
              icon={Users2}
            >
              Group Hub
            </Button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
        <StatCard
          title="Enrolled Courses"
          value={stats.enrolledCoursesCount}
          subtitle="Spring 2026"
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalAssignments}
          subtitle="All deliverables"
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={stats.completedAssignments}
          subtitle="Acknowledged work"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending"
          value={stats.pendingAssignments}
          subtitle="Tasks to submit"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueAssignments}
          subtitle="Past deadlines"
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="Completion %"
          value={`${stats.completionPercentage}%`}
          subtitle="Overall progress"
          icon={Flame}
          color="indigo"
        />
      </div>

      {/* Course Cards & Submission Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Cards List (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Enrolled Courses</h2>
              <p className="text-xs text-slate-500">
                Click a course to view assignment requirements and deadlines
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/student/courses')}
              icon={ArrowRight}
              iconPosition="right"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => {
              const courseStats = getCourseStats(course.id);

              return (
                <Card key={course.id} hover className="overflow-hidden flex flex-col justify-between">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {course.code}
                      </span>
                      <Badge variant="purple" size="sm">
                        {course.term}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {course.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      Instructor: <span className="font-semibold text-slate-700">{course.professorName}</span>
                    </p>

                    <div className="py-2.5 px-3 bg-slate-50/80 rounded-xl border border-slate-100 mb-4 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Total Assignments:</span>
                      <span className="font-bold text-slate-800">
                        {courseStats.totalAssignments} Deliverables
                      </span>
                    </div>

                    <ProgressBar
                      value={courseStats.completionRate}
                      showLabel
                      labelPrefix="Course Completion"
                    />
                  </div>

                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      {courseStats.completionRate}% Done
                    </span>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/student/assignments?course=${course.id}`)}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      View Assignments
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Col: Completion Distribution Chart */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Task Overview</h2>
            <p className="text-xs text-slate-500">Your personal progress status</p>
          </div>

          <Card className="p-6">
            <div className="h-56 w-full">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white p-2 rounded-xl text-xs shadow-md">
                              <span className="font-semibold">{payload[0].name}: </span>
                              <span>{payload[0].value} assignments</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No assignment data available
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
              <div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-1" />
                <span className="text-[11px] text-slate-500 block">Completed</span>
                <span className="text-xs font-bold text-slate-800">
                  {stats.completedAssignments}
                </span>
              </div>
              <div>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block mr-1" />
                <span className="text-[11px] text-slate-500 block">Pending</span>
                <span className="text-xs font-bold text-slate-800">
                  {stats.pendingAssignments}
                </span>
              </div>
              <div>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block mr-1" />
                <span className="text-[11px] text-slate-500 block">Overdue</span>
                <span className="text-xs font-bold text-slate-800">
                  {stats.overdueAssignments}
                </span>
              </div>
            </div>
          </Card>

          {/* Student Quick Tip */}
          <Card className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-indigo-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
              Submission Guidelines
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              For group assignments, the group leader acknowledges submission on behalf of all members. Make sure to create or join a group before submitting!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
