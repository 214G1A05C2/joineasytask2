import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  BookOpen,
  Users2,
  ClipboardList,
  Search,
  ArrowRight,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export const StudentCourses = () => {
  const { user } = useAuth();
  const { courses, groups, getCourseStats } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const enrolledCourses = courses.filter((c) => c.studentIds?.includes(user?.id));

  const filtered = enrolledCourses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-slate-500">
            Access learning modules, assignment submissions, and team collaboration
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => {
          const stats = getCourseStats(course.id);
          const studentGroup = groups.find(
            (g) => g.courseId === course.id && g.memberIds.includes(user?.id)
          );

          return (
            <Card key={course.id} hover className="flex flex-col justify-between">
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {course.code}
                  </span>
                  <Badge variant="purple" size="sm">
                    {course.term}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Professor: <span className="font-semibold text-slate-700">{course.professorName}</span>
                </p>

                <p className="text-xs text-slate-500 line-clamp-2 mb-6">
                  {course.description}
                </p>

                {/* Group Status Card */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Group Status
                  </span>
                  {studentGroup ? (
                    <span className="font-semibold text-indigo-700 flex items-center gap-1 mt-0.5">
                      <Users2 className="w-3.5 h-3.5" /> {studentGroup.name} (
                      {studentGroup.leaderId === user?.id ? 'Leader' : 'Member'})
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium italic block mt-0.5">
                      No group joined yet
                    </span>
                  )}
                </div>

                <ProgressBar
                  value={stats.completionRate}
                  showLabel
                  labelPrefix="Progress"
                />
              </div>

              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/student/groups?course=${course.id}`)}
                >
                  Group Hub
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate(`/student/assignments?course=${course.id}`)}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Assignments
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
