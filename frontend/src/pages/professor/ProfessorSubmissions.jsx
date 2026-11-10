import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import {
  FileCheck2,
  Users2,
  User,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Crown,
  Calendar,
  Eye,
  FolderOpen
} from 'lucide-react';

export const ProfessorSubmissions = () => {
  const { user } = useAuth();
  const {
    courses,
    assignments,
    groups,
    submissions,
    users,
    getAssignmentStats,
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();

  // Current filters
  const currentAssignmentId = searchParams.get('assignment');
  const currentCourseId = searchParams.get('course') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, submitted, pending
  const [detailModalItem, setDetailModalItem] = useState(null);

  // Professor's assignments
  const profCourses = courses.filter((c) => c.professorId === user?.id);
  const profCourseIds = profCourses.map((c) => c.id);
  const profAssignments = assignments.filter((a) => profCourseIds.includes(a.courseId));

  // Determine active assignment
  const activeAssignment = currentAssignmentId
    ? profAssignments.find((a) => a.id === currentAssignmentId) || profAssignments[0]
    : profAssignments[0];

  const activeCourse = courses.find((c) => c.id === activeAssignment?.courseId);
  const activeStats = activeAssignment ? getAssignmentStats(activeAssignment.id) : null;
  const assignmentSubmissions = activeAssignment
    ? submissions.filter((s) => s.assignmentId === activeAssignment.id)
    : [];

  // Build rows depending on submissionType
  let submissionRows = [];
  if (activeAssignment?.submissionType === 'Individual') {
    const enrolledStudents = users.filter((u) => activeCourse?.studentIds?.includes(u.id));
    submissionRows = enrolledStudents.map((stud) => {
      const sub = assignmentSubmissions.find((s) => s.studentId === stud.id);
      return {
        id: stud.id,
        name: stud.name,
        email: stud.email,
        rollNumber: stud.rollNumber,
        avatar: stud.avatar,
        status: sub ? 'Submitted' : 'Pending',
        timestamp: sub ? sub.acknowledgedAt : null,
        acknowledgedBy: sub ? sub.acknowledgedBy : null,
        isGroup: false,
      };
    });
  } else if (activeAssignment?.submissionType === 'Group') {
    const courseGroups = groups.filter((g) => g.courseId === activeAssignment.courseId);
    submissionRows = courseGroups.map((grp) => {
      const sub = assignmentSubmissions.find((s) => s.groupId === grp.id);
      const members = users.filter((u) => grp.memberIds.includes(u.id));
      const leader = users.find((u) => u.id === grp.leaderId);

      return {
        id: grp.id,
        name: grp.name,
        leaderName: leader?.name || grp.leaderName,
        leaderEmail: leader?.email,
        members,
        status: sub ? 'Submitted' : 'Pending',
        timestamp: sub ? sub.acknowledgedAt : null,
        acknowledgedBy: sub ? sub.acknowledgedBy : null,
        isGroup: true,
      };
    });
  }

  // Filter rows by search and status
  const filteredRows = submissionRows
    .filter((row) => {
      if (statusFilter === 'submitted') return row.status === 'Submitted';
      if (statusFilter === 'pending') return row.status === 'Pending';
      return true;
    })
    .filter((row) => {
      const nameMatch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = row.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const leaderMatch = row.leaderName?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      return nameMatch || emailMatch || leaderMatch;
    });

  const formatTimestamp = (iso) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Submission Tracking
          </h1>
          <p className="text-sm text-slate-500">
            Monitor real-time student acknowledgements and collaborative group submissions
          </p>
        </div>

        {/* Assignment Selector Dropdown */}
        <div className="w-full sm:w-80">
          <select
            value={activeAssignment?.id || ''}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('assignment', e.target.value);
              setSearchParams(newParams);
            }}
            className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-xs"
          >
            {profAssignments.map((a) => {
              const crs = courses.find((c) => c.id === a.courseId);
              return (
                <option key={a.id} value={a.id}>
                  [{crs?.code}] {a.title} ({a.submissionType})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {!activeAssignment ? (
        <EmptyState
          title="No assignments found"
          description="Create assignments in your courses to start tracking student submissions."
        />
      ) : (
        <>
          {/* Active Assignment Overview Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {activeCourse?.code} – {activeCourse?.name}
                  </span>
                  <Badge
                    variant={activeAssignment.submissionType === 'Group' ? 'purple' : 'info'}
                    icon={activeAssignment.submissionType === 'Group' ? Users2 : User}
                  >
                    {activeAssignment.submissionType} Deliverable
                  </Badge>
                  {activeStats?.isOverdue && (
                    <Badge variant="danger" dot>
                      Past Deadline
                    </Badge>
                  )}
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {activeAssignment.title}
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  {activeAssignment.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Deadline: {formatTimestamp(activeAssignment.deadline)}
                  </span>
                  <a
                    href={activeAssignment.oneDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-semibold inline-flex items-center gap-1 hover:underline"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> OneDrive Repository
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Summary Stats Pill Box */}
              <div className="lg:w-80 bg-slate-50 rounded-2xl p-4 border border-slate-100 shrink-0">
                <div className="grid grid-cols-2 gap-3 text-center mb-3">
                  <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Submitted
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      {activeStats?.submittedCount} / {activeStats?.totalCount}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Pending
                    </span>
                    <span className="text-lg font-bold text-amber-600">
                      {activeStats?.pendingCount}
                    </span>
                  </div>
                </div>

                <ProgressBar
                  value={activeStats?.percentage || 0}
                  showLabel
                  labelPrefix="Completion Rate"
                  color={activeStats?.percentage === 100 ? 'emerald' : 'indigo'}
                />
              </div>
            </div>
          </div>

          {/* Table Controls (Search & Status Filters) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {[
                { id: 'all', label: `All (${submissionRows.length})` },
                {
                  id: 'submitted',
                  label: `Submitted (${submissionRows.filter((r) => r.status === 'Submitted').length})`,
                },
                {
                  id: 'pending',
                  label: `Pending (${submissionRows.filter((r) => r.status === 'Pending').length})`,
                },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeAssignment.submissionType === 'Group'
                    ? 'Search group or leader...'
                    : 'Search student name/email...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Submissions Table / Cards */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {filteredRows.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                No students or groups found matching your filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">
                        {activeAssignment.submissionType === 'Group' ? 'Group Name' : 'Student'}
                      </th>
                      {activeAssignment.submissionType === 'Group' && (
                        <th className="px-6 py-4">Leader & Members</th>
                      )}
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Acknowledgement Timestamp</th>
                      <th className="px-6 py-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Name Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.isGroup ? (
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
                                <Users2 className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">
                                  {row.name}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {row.members?.length} Members
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <img
                                src={row.avatar}
                                alt={row.name}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/10"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">
                                  {row.name}
                                </span>
                                <span className="text-xs text-slate-400">{row.email}</span>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Group Members Column (If group) */}
                        {activeAssignment.submissionType === 'Group' && (
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900">
                                <Crown className="w-3.5 h-3.5 text-amber-500" />
                                <span>Leader: {row.leaderName}</span>
                              </div>
                              <div className="flex items-center gap-1 flex-wrap">
                                {row.members?.map((m) => (
                                  <span
                                    key={m.id}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]"
                                    title={m.email}
                                  >
                                    {m.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                        )}

                        {/* Status Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {row.status === 'Submitted' ? (
                            <Badge variant="success" icon={CheckCircle2} dot size="sm">
                              Submitted
                            </Badge>
                          ) : (
                            <Badge variant="warning" icon={Clock} dot size="sm">
                              Pending
                            </Badge>
                          )}
                        </td>

                        {/* Timestamp Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          {row.status === 'Submitted' ? (
                            <div>
                              <span className="font-semibold text-slate-700 block">
                                {formatTimestamp(row.timestamp)}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                by {row.acknowledgedBy}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Not acknowledged yet</span>
                          )}
                        </td>

                        {/* Action Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => setDetailModalItem(row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View detailed log"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* DETAIL MODAL FOR SUBMISSION */}
      <Modal
        isOpen={!!detailModalItem}
        onClose={() => setDetailModalItem(null)}
        title={detailModalItem?.isGroup ? 'Group Submission Details' : 'Student Submission Details'}
        subtitle={`Audit log for ${activeAssignment?.title}`}
      >
        {detailModalItem && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-900">{detailModalItem.name}</span>
              </div>
              {detailModalItem.email && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-slate-700">{detailModalItem.email}</span>
                </div>
              )}
              {detailModalItem.isGroup && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Group Leader:</span>
                  <span className="font-semibold text-indigo-700">
                    {detailModalItem.leaderName}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <Badge
                  variant={detailModalItem.status === 'Submitted' ? 'success' : 'warning'}
                  size="sm"
                  dot
                >
                  {detailModalItem.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recorded Timestamp:</span>
                <span className="font-medium text-slate-800">
                  {formatTimestamp(detailModalItem.timestamp)}
                </span>
              </div>
              {detailModalItem.acknowledgedBy && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Acknowledged By:</span>
                  <span className="font-medium text-slate-800">
                    {detailModalItem.acknowledgedBy}
                  </span>
                </div>
              )}
            </div>

            {detailModalItem.isGroup && detailModalItem.members && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  All Group Members ({detailModalItem.members.length}):
                </p>
                <div className="space-y-1.5">
                  {detailModalItem.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-medium text-slate-800">{m.name}</span>
                      </div>
                      <span className="text-slate-400">{m.rollNumber || m.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button variant="secondary" onClick={() => setDetailModalItem(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
