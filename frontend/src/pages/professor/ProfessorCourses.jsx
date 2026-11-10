import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import {
  BookOpen,
  Users,
  ClipboardList,
  Search,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Calendar,
  Layers
} from 'lucide-react';

export const ProfessorCourses = () => {
  const { user } = useAuth();
  const { courses, groups, getCourseStats, users } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const profCourses = courses.filter((c) => c.professorId === user?.id);

  const filteredCourses = profCourses.filter(
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
            My Courses
          </h1>
          <p className="text-sm text-slate-500">
            Manage your teaching curriculum, student enrollment, and course progress
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses or codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const stats = getCourseStats(course.id);
          const courseGroups = groups.filter((g) => g.courseId === course.id);
          const enrolledStudentsList = users.filter((u) => course.studentIds?.includes(u.id));

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

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-6">
                  {course.description}
                </p>

                {/* Course Metadata Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 bg-slate-50/80 rounded-xl px-3 border border-slate-100 text-center mb-6">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Students
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {stats.enrolledStudents}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Tasks
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {stats.totalAssignments}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Groups
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {courseGroups.length}
                    </span>
                  </div>
                </div>

                {/* Enrolled Avatars Preview */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">
                    Enrolled Students Preview:
                  </p>
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {enrolledStudentsList.slice(0, 5).map((s) => (
                      <img
                        key={s.id}
                        src={s.avatar}
                        alt={s.name}
                        title={s.name}
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                    {enrolledStudentsList.length > 5 && (
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold ring-2 ring-white">
                        +{enrolledStudentsList.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <ProgressBar
                  value={stats.completionRate}
                  showLabel
                  labelPrefix="Submission Rate"
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/professor/submissions?course=${course.id}`)}
                >
                  Submissions
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate(`/professor/assignments?course=${course.id}`)}
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
