import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Calendar,
  ExternalLink,
  Users2,
  User,
  AlertCircle,
  Clock,
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  Eye
} from 'lucide-react';

export const ProfessorAssignments = () => {
  const { user } = useAuth();
  const {
    courses,
    assignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentStats,
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedCourseId = searchParams.get('course') || 'all';

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, overdue
  const [typeFilter, setTypeFilter] = useState('all'); // all, Individual, Group
  const [sortBy, setSortBy] = useState('newest'); // newest, deadline

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deletingAssignment, setDeletingAssignment] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: courses[0]?.id || '',
    deadline: '',
    oneDriveLink: '',
    submissionType: 'Individual',
  });

  const profCourses = courses.filter((c) => c.professorId === user?.id);
  const profCourseIds = profCourses.map((c) => c.id);

  // Check if open modal from query param
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setIsCreateOpen(true);
      // Clean query
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.courseId) errors.courseId = 'Please select a course';
    if (!formData.deadline) {
      errors.deadline = 'Deadline date & time is required';
    }

    if (!formData.oneDriveLink.trim()) {
      errors.oneDriveLink = 'OneDrive URL is required';
    } else {
      try {
        const url = new URL(formData.oneDriveLink.trim());
        if (!url.protocol.startsWith('http')) {
          errors.oneDriveLink = 'Enter a valid web URL (http:// or https://)';
        }
      } catch (e) {
        errors.oneDriveLink = 'Please enter a valid URL (e.g. https://onedrive.live.com/...)';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      courseId: selectedCourseId !== 'all' ? selectedCourseId : profCourses[0]?.id || '',
      deadline: '',
      oneDriveLink: '',
      submissionType: 'Individual',
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (assign) => {
    // Format deadline to datetime-local format: YYYY-MM-DDTHH:MM
    const date = new Date(assign.deadline);
    const formattedDate = date.toISOString().slice(0, 16);

    setEditingAssignment(assign);
    setFormData({
      title: assign.title,
      description: assign.description,
      courseId: assign.courseId,
      deadline: formattedDate,
      oneDriveLink: assign.oneDriveLink,
      submissionType: assign.submissionType,
    });
    setFormErrors({});
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    createAssignment(formData);
    setIsCreateOpen(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateAssignment(editingAssignment.id, formData);
    setEditingAssignment(null);
  };

  const handleConfirmDelete = () => {
    if (deletingAssignment) {
      deleteAssignment(deletingAssignment.id);
      setDeletingAssignment(null);
    }
  };

  // Filter & Sort assignments
  const filteredAssignments = assignments
    .filter((a) => profCourseIds.includes(a.courseId))
    .filter((a) => (selectedCourseId === 'all' ? true : a.courseId === selectedCourseId))
    .filter((a) => (typeFilter === 'all' ? true : a.submissionType === typeFilter))
    .filter((a) => {
      const isOverdue = new Date(a.deadline) < new Date();
      if (statusFilter === 'active') return !isOverdue;
      if (statusFilter === 'overdue') return isOverdue;
      return true;
    })
    .filter((a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else {
        return new Date(a.deadline) - new Date(b.deadline);
      }
    });

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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Assignment Management
          </h1>
          <p className="text-sm text-slate-500">
            Create, monitor, and configure course deliverables and deadlines
          </p>
        </div>

        <Button onClick={handleOpenCreate} icon={Plus}>
          Create Assignment
        </Button>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assignments..."
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
              <option value="all">All Courses</option>
              {profCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submission Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            >
              <option value="all">All Submission Types</option>
              <option value="Individual">Individual Only</option>
              <option value="Group">Group Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="deadline">Sort: By Deadline (Earliest)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {[
            { id: 'all', label: 'All Assignments' },
            { id: 'active', label: 'Active & Upcoming' },
            { id: 'overdue', label: 'Past Deadline (Overdue)' },
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

      {/* Assignments List / Grid */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="No assignments match your criteria"
          description="Try clearing search filters or create a new assignment for your students."
          actionText="Create Assignment"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.map((assign) => {
            const course = courses.find((c) => c.id === assign.courseId);
            const stats = getAssignmentStats(assign.id);
            const isOverdue = stats?.isOverdue;

            return (
              <Card key={assign.id} className="flex flex-col justify-between overflow-hidden">
                <div className="p-6">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {course?.code || 'Course'}
                      </span>
                      <Badge
                        variant={assign.submissionType === 'Group' ? 'purple' : 'info'}
                        icon={assign.submissionType === 'Group' ? Users2 : User}
                        size="sm"
                      >
                        {assign.submissionType}
                      </Badge>
                      {isOverdue && (
                        <Badge variant="danger" icon={AlertCircle} size="sm" dot>
                          Past Deadline
                        </Badge>
                      )}
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(assign)}
                        title="Edit Assignment"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingAssignment(assign)}
                        title="Delete Assignment"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {assign.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {assign.description}
                  </p>

                  {/* Deadline & OneDrive */}
                  <div className="space-y-1.5 mb-5 text-xs text-slate-500 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
                        Deadline:
                      </span>
                      <span className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                        {formatDeadline(assign.deadline)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="font-medium">OneDrive Folder:</span>
                      <a
                        href={assign.oneDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 hover:underline"
                      >
                        Open Folder <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Progress Stats Section as required */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        Submitted: {stats?.submittedCount || 0} / {stats?.totalCount || 0}{' '}
                        {stats?.unit || 'units'}
                      </span>
                      <span className="text-slate-500">
                        Pending: {stats?.pendingCount || 0} {stats?.unit || 'units'}
                      </span>
                    </div>

                    <ProgressBar
                      value={stats?.percentage || 0}
                      showLabel
                      labelPrefix="Progress"
                      color={isOverdue && stats?.percentage < 50 ? 'rose' : 'indigo'}
                    />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Created {new Date(assign.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/professor/submissions?assignment=${assign.id}`)}
                    icon={Eye}
                  >
                    Track Submissions
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT ASSIGNMENT MODAL */}
      <Modal
        isOpen={isCreateOpen || !!editingAssignment}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingAssignment(null);
        }}
        title={editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
        subtitle="Specify the assignment scope, submission format, and OneDrive repository"
      >
        <form onSubmit={editingAssignment ? handleSubmitEdit : handleSubmitCreate} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. React Dashboard Development"
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {formErrors.title && (
              <p className="mt-1 text-xs text-rose-600">{formErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe requirements, deliverables, and assessment guidelines..."
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.description ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-rose-600">{formErrors.description}</p>
            )}
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Course *
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {profCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submission Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Submission Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, submissionType: 'Individual' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  formData.submissionType === 'Individual'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4" /> Individual
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, submissionType: 'Group' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  formData.submissionType === 'Group'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users2 className="w-4 h-4" /> Group Assignment
              </button>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Deadline (Date & Time) *
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.deadline ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {formErrors.deadline && (
              <p className="mt-1 text-xs text-rose-600">{formErrors.deadline}</p>
            )}
          </div>

          {/* OneDrive URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              OneDrive Folder Link *
            </label>
            <input
              type="url"
              value={formData.oneDriveLink}
              onChange={(e) => setFormData({ ...formData, oneDriveLink: e.target.value })}
              placeholder="https://onedrive.live.com/..."
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                formErrors.oneDriveLink ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {formErrors.oneDriveLink && (
              <p className="mt-1 text-xs text-rose-600">{formErrors.oneDriveLink}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingAssignment(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingAssignment ? 'Save Changes' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!deletingAssignment}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${deletingAssignment?.title}"? All associated submission acknowledgements will also be permanently deleted.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};
