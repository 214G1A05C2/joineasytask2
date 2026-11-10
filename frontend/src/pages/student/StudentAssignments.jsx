import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Users2,
  User,
  AlertCircle,
  Crown,
  Search,
  Filter,
  Check,
  FolderOpen,
  ArrowRight
} from 'lucide-react';

export const StudentAssignments = () => {
  const { user } = useAuth();
  const {
    courses,
    assignments,
    groups,
    submissions,
    acknowledgeIndividual,
    acknowledgeGroup,
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedCourseId = searchParams.get('course') || 'all';

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, submitted, overdue
  const [typeFilter, setTypeFilter] = useState('all'); // all, Individual, Group

  // Confirmation Modal state
  const [confirmingSubmission, setConfirmingSubmission] = useState(null); // { assignment, type, group? }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const enrolledCourses = courses.filter((c) => c.studentIds?.includes(user?.id));
  const enrolledCourseIds = enrolledCourses.map((c) => c.id);

  const formatDeadline = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeRemaining = (deadlineIso) => {
    const diff = new Date(deadlineIso) - new Date();
    if (diff <= 0) {
      return { text: 'Overdue', isOverdue: true };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    if (days > 0) {
      return { text: `${days}d ${hours}h remaining`, isOverdue: false };
    }
    return { text: `${hours} hours remaining`, isOverdue: false };
  };

  const handleOpenConfirm = (assign, studentGroup) => {
    setConfirmingSubmission({
      assignment: assign,
      group: studentGroup,
    });
  };

  const handleConfirmSubmit = async () => {
    if (!confirmingSubmission) return;

    setIsSubmitting(true);
    try {
      const { assignment, group } = confirmingSubmission;
      if (assignment.submissionType === 'Individual') {
        acknowledgeIndividual({
          assignmentId: assignment.id,
          studentId: user.id,
          studentName: user.name,
          studentEmail: user.email,
        });
      } else {
        acknowledgeGroup({
          assignmentId: assignment.id,
          groupId: group.id,
          leaderId: user.id,
          leaderName: user.name,
        });
      }
      setConfirmingSubmission(null);
    } catch (err) {
      // Error handled by DataContext toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter and enrich assignments for current student
  const filteredAssignments = assignments
    .filter((a) => enrolledCourseIds.includes(a.courseId))
    .filter((a) => (selectedCourseId === 'all' ? true : a.courseId === selectedCourseId))
    .filter((a) => (typeFilter === 'all' ? true : a.submissionType === typeFilter))
    .map((a) => {
      const course = courses.find((c) => c.id === a.courseId);
      const studentGroup = groups.find(
        (g) => g.courseId === a.courseId && g.memberIds.includes(user?.id)
      );

      let isSubmitted = false;
      let submissionRecord = null;

      if (a.submissionType === 'Individual') {
        submissionRecord = submissions.find(
          (s) => s.assignmentId === a.id && s.studentId === user?.id
        );
        isSubmitted = !!submissionRecord;
      } else {
        if (studentGroup) {
          submissionRecord = submissions.find(
            (s) => s.assignmentId === a.id && s.groupId === studentGroup.id
          );
          isSubmitted = !!submissionRecord;
        }
      }

      const timeRemaining = getTimeRemaining(a.deadline);
      const isOverdue = !isSubmitted && timeRemaining.isOverdue;

      return {
        ...a,
        course,
        studentGroup,
        isSubmitted,
        submissionRecord,
        timeRemaining,
        isOverdue,
      };
    })
    .filter((a) => {
      if (statusFilter === 'submitted') return a.isSubmitted;
      if (statusFilter === 'pending') return !a.isSubmitted;
      if (statusFilter === 'overdue') return a.isOverdue;
      return true;
    })
    .filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Course Assignments
          </h1>
          <p className="text-sm text-slate-500">
            View assignment guidelines, open submission folders, and acknowledge your work
          </p>
        </div>
      </div>

      {/* Filter and Course Selector Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assignments or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Course Selector */}
          <div>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                const newParams = new URLSearchParams(searchParams);
                if (e.target.value === 'all') {
                  newParams.delete('course');
                } else {
                  newParams.set('course', e.target.value);
                }
                setSearchParams(newParams);
              }}
              className="w-full py-2 px-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            >
              <option value="all">All Enrolled Courses</option>
              {enrolledCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submission Type */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            >
              <option value="all">All Types</option>
              <option value="Individual">Individual Tasks</option>
              <option value="Group">Group Deliverables</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Status:
          </span>
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'pending', label: 'Pending Submission' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'overdue', label: 'Overdue' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments Cards Grid */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="There are currently no assignments matching your chosen filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.map((assign) => {
            const isGroup = assign.submissionType === 'Group';
            const hasGroup = !!assign.studentGroup;
            const isLeader = hasGroup && assign.studentGroup.leaderId === user?.id;

            return (
              <Card
                key={assign.id}
                className={`flex flex-col justify-between overflow-hidden transition-all ${
                  assign.isSubmitted
                    ? 'border-emerald-200/80 ring-1 ring-emerald-500/10'
                    : assign.isOverdue
                    ? 'border-rose-200/80 ring-1 ring-rose-500/10'
                    : ''
                }`}
              >
                <div className="p-6">
                  {/* Top Header: Course & Status Badges */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {assign.course?.code}
                      </span>
                      <Badge
                        variant={isGroup ? 'purple' : 'info'}
                        icon={isGroup ? Users2 : User}
                        size="sm"
                      >
                        {assign.submissionType}
                      </Badge>
                    </div>

                    {/* Status Badge */}
                    {assign.isSubmitted ? (
                      <Badge variant="success" icon={CheckCircle2} dot size="sm">
                        Submitted
                      </Badge>
                    ) : assign.isOverdue ? (
                      <Badge variant="danger" icon={AlertCircle} dot size="sm">
                        Overdue
                      </Badge>
                    ) : (
                      <Badge variant="warning" icon={Clock} dot size="sm">
                        Pending
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {assign.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {assign.description}
                  </p>

                  {/* Deadline & OneDrive Link */}
                  <div className="space-y-2 mb-5 text-xs bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium text-slate-500">
                        <Clock
                          className={`w-3.5 h-3.5 ${
                            assign.isOverdue ? 'text-rose-500' : 'text-slate-400'
                          }`}
                        />
                        Deadline:
                      </span>
                      <span
                        className={`font-semibold ${
                          assign.isOverdue ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {formatDeadline(assign.deadline)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Time remaining:</span>
                      <span
                        className={`font-semibold ${
                          assign.isOverdue ? 'text-rose-600' : 'text-indigo-600'
                        }`}
                      >
                        {assign.timeRemaining.text}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="font-medium text-slate-500">OneDrive Folder:</span>
                      <a
                        href={assign.oneDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 hover:underline"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        Open Upload Folder <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* GROUP ASSIGNMENT NOT-IN-GROUP NOTICE (Exact requirement) */}
                  {isGroup && !hasGroup && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold leading-relaxed">
                          You are not part of any group. Create or join one to submit this assignment.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/student/groups?course=${assign.courseId}`)}
                        className="w-full bg-white text-amber-900 border-amber-300 hover:bg-amber-100 font-semibold text-xs"
                      >
                        Create or Join Group
                      </Button>
                    </div>
                  )}

                  {/* GROUP INFO IF IN A GROUP */}
                  {isGroup && hasGroup && (
                    <div className="mb-2 p-2.5 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Users2 className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-purple-900">
                          Group: {assign.studentGroup.name}
                        </span>
                      </div>
                      <span className="text-purple-700 font-medium">
                        {isLeader ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                            <Crown className="w-3.5 h-3.5" /> You are Leader
                          </span>
                        ) : (
                          `Leader: ${assign.studentGroup.leaderName}`
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* BOTTOM ACKNOWLEDGEMENT AREA */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                  {/* CASE 1: ALREADY SUBMITTED */}
                  {assign.isSubmitted ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <div>
                        {isGroup && !isLeader ? (
                          <span>
                            Acknowledged by {assign.submissionRecord?.acknowledgedBy} on{' '}
                            {formatDeadline(assign.submissionRecord?.acknowledgedAt)}
                          </span>
                        ) : (
                          <span>
                            Submitted on {formatDeadline(assign.submissionRecord?.acknowledgedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : /* CASE 2: INDIVIDUAL ASSIGNMENT - NOT YET SUBMITTED */
                  !isGroup ? (
                    <Button
                      onClick={() => handleOpenConfirm(assign, null)}
                      className="w-full shadow-sm"
                      icon={Check}
                    >
                      Yes, I have submitted
                    </Button>
                  ) : /* CASE 3: GROUP ASSIGNMENT & USER IS LEADER */
                  isGroup && hasGroup && isLeader ? (
                    <div className="space-y-1.5">
                      <Button
                        onClick={() => handleOpenConfirm(assign, assign.studentGroup)}
                        className="w-full bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500 shadow-sm"
                        icon={Crown}
                      >
                        Yes, I have submitted (as Group Leader)
                      </Button>
                      <p className="text-[11px] text-center text-slate-500">
                        Submitting marks this assignment as submitted for all {assign.studentGroup.memberIds.length} members.
                      </p>
                    </div>
                  ) : /* CASE 4: GROUP ASSIGNMENT & USER IS NON-LEADER MEMBER */
                  isGroup && hasGroup && !isLeader ? (
                    <div className="p-2.5 bg-slate-100 rounded-xl text-center text-xs text-slate-600 font-medium">
                      Waiting for group leader ({assign.studentGroup.leaderName}) to acknowledge submission.
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR SUBMISSION */}
      <ConfirmDialog
        isOpen={!!confirmingSubmission}
        onClose={() => setConfirmingSubmission(null)}
        onConfirm={handleConfirmSubmit}
        loading={isSubmitting}
        title="Confirm Assignment Submission"
        message={
          confirmingSubmission?.assignment.submissionType === 'Group'
            ? `Are you sure you want to acknowledge submission for "${confirmingSubmission?.assignment.title}" on behalf of group "${confirmingSubmission?.group?.name}"? Please ensure you have uploaded the project files to the OneDrive folder.`
            : `Are you sure you want to acknowledge your submission for "${confirmingSubmission?.assignment.title}"? Please verify that you have uploaded your files to the OneDrive folder.`
        }
        confirmText="Yes, Confirm Submission"
        cancelText="Cancel"
        type="success"
      />
    </div>
  );
};
